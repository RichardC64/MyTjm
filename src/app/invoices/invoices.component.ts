import { BreakpointObserver } from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ITjmEvent } from '@entities';
import { Calendar } from '@microsoft/microsoft-graph-types';
import { TjmEventsService } from '@services/msgraph/outlook';
import { UserService } from '@services/msgraph/user';
import * as moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['../shared/shared.scss', './invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  calendars: Calendar[];
  events: ITjmEvent[];
  isWorking = false;
  isConnected = false;
  currentDate = moment();
  monthlyIncomes = 0;
  groups: TjmEventGroup[];
  displayedColumns = ['date', 'position', 'cout'];
  showCost = false;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar,
    private eventsService: TjmEventsService,
    private userService: UserService) { }

  ngOnInit() {
    this.isWorking = true;
    this.userService.getMe().subscribe(me => {
      this.isWorking = false;
      this.isConnected = me != null;
      if (!this.isConnected) { return; }

      this.refresh();
    });
  }

  private refresh() {

    const startDate = this.currentDate.clone().startOf('month');
    const endDate = this.currentDate.clone().endOf('month');

    this.monthlyIncomes = 0;
    this.isWorking = true;
    this.events = [];
    this.eventsService.getEvents(startDate, endDate).subscribe(myEvents => {
      this.isWorking = false;
      this.events = myEvents;
      const gp = myEvents.reduce((prev, curr: ITjmEvent) => {
        if (prev[curr.datas.client.id] == null) {
          prev[curr.datas.client.id] = [];
        }
        prev[curr.datas.client.id].push(curr);
        return prev;
      }, {});

      // groupés par client.id
      this.groups = Object.keys(gp).map(key => ({ clientId: key, tjmEvents: gp[key], dayCosts: [] }));

      this.groups.forEach(group => {
        let currentDay = moment(startDate);
        while (currentDay < moment(endDate)) {
          if (currentDay.day() !== 0 && currentDay.day() !== 6) {

            // tjms du jour
            const events = group.tjmEvents
              .filter(tjm => moment.tz(tjm.outlookEvent.start.dateTime, tjm.outlookEvent.start.timeZone).isSame(currentDay, 'day'));

            const initCost = 0;
            const dayCost: DayCost = {
              cost: events.reduce((accu, current) => accu + current.datas.cost, initCost),
              date: moment(currentDay),
              number: events.length / 2
            };
            group.dayCosts.push(dayCost);
          }

          currentDay = currentDay.add(1, 'day');
        }
      });

      myEvents.forEach(tjmEvent => {
        this.monthlyIncomes += tjmEvent.datas.cost;
      });
    }, error => {
      this.isWorking = false;
      this.snackBar.open('Erreur au chargement des tjms');
    });
  }

  getClientTotalCost(tjmEvents: ITjmEvent[]): number {
    let total = 0;
    tjmEvents.forEach(tjmEvent => { total += tjmEvent.datas.cost; });

    return total;
  }

  onChangeMonth(incre: number) {
    this.currentDate = this.currentDate.add(incre, 'month').clone();

    this.refresh();
  }
}

export class TjmEventGroup {
  clientId: string;
  tjmEvents: ITjmEvent[];
  dayCosts: DayCost[];
}

export class DayCost {
  date: moment.Moment;
  cost: number;
  number: number;
}

