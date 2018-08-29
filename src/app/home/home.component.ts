import { NewTjmEventComponent } from './new-tjm-event.component';
import { Breakpoints } from '@angular/cdk/layout';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ITjmEvent } from '@entities';
import { Calendar } from '@microsoft/microsoft-graph-types';
import { CalendarsService, TjmEventsService } from '@services/msgraph/outlook';
import { UserService } from '@services/msgraph/user';
import * as moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../shared/shared.scss']
})
export class HomeComponent implements OnInit {
  calendars: Calendar[];
  events: ITjmEvent[];
  isWorking = false;
  isConnected = false;
  cardDatas: ICardData[] = [];
  currentDate = moment();

  monthlyIncomes = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private calendarsService: CalendarsService,
    private eventsService: TjmEventsService,
    private userService: UserService) { }

  ngOnInit() {
    this.isWorking = true;
    this.userService.getMe().subscribe(me => {
      this.isWorking = false;
      this.isConnected = me != null;
      if (!this.isConnected) { return; }

      this.calendarsService.getCalendars().subscribe(calendars => {
        this.calendars = calendars;
      });

      this.refresh();
    });
  }

  private refresh() {
    this.cardDatas = [];
    const startDate = moment(this.currentDate).startOf('month').startOf('isoWeek');
    const endDate = moment(this.currentDate).endOf('month').endOf('isoWeek');
    const firstDate = startDate.clone();

    while (firstDate.diff(endDate) <= 0) {
      if (firstDate.day() !== 0 && firstDate.day() !== 6) {
        this.cardDatas.push({
          date: new Date(firstDate.toDate()),
          tjmEvents: []
        });
      }
      firstDate.add(1, 'day');
    }

    this.monthlyIncomes = 0;
    this.isWorking = true;
    this.eventsService.getEvents(startDate, endDate).subscribe(myEvents => {
      this.isWorking = false;
      myEvents.forEach(tjmEvent => {
        const mStartTime = moment.tz(tjmEvent.outlookEvent.start.dateTime, tjmEvent.outlookEvent.start.timeZone);
        const cardData = this.cardDatas.filter(cd => mStartTime.isSame(cd.date, 'day'))[0] || null;
        if (cardData != null) {
          cardData.tjmEvents.push(tjmEvent);
          if (moment(this.currentDate).isSame(mStartTime, 'month')) {
            this.monthlyIncomes += tjmEvent.datas.cost;
          }
        }
      });
    }, error => {
      this.isWorking = false;
      this.snackBar.open('Erreur au chargement des tjms');
    });
  }

  onChangeMonth(incre: number) {
    this.currentDate = this.currentDate.add(incre, 'month').clone();

    this.refresh();
  }

  remove(tjmEvent: ITjmEvent) {
    this.eventsService.deleteEvent(tjmEvent.outlookEvent.id).subscribe(result => {
      this.snackBar.open('Tjm supprimé');
      this.refresh();
    }, error => {
      this.snackBar.open('Erreur à la suppression');
      this.refresh();
    });
  }
  create(date: Date) {
    const dialogRef = this.matDialog.open(NewTjmEventComponent, {
      data: { date: date }
    });

    dialogRef.afterClosed().subscribe(tjmEvent => {
      if (tjmEvent === false) { return; }
      this.refresh();

    });
  }
}

export interface ICardData {
  date: Date;
  tjmEvents: ITjmEvent[];
}

