import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ErrorStateMatcher, MatSnackBar } from '@angular/material';
import { IParameter } from '@entities';
import { Calendar } from '@microsoft/microsoft-graph-types';
import { ParametersService } from '@services/datas';
import { CalendarsService } from '@services/msgraph/outlook';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['../shared/shared.scss']
})
export class ParametersComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  form: FormGroup;
  matcher = new ErrorStateMatcher();
  isWorking = false;
  calendars: Calendar[];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private parametersService: ParametersService,
    private snackBar: MatSnackBar,
    private calendarsService: CalendarsService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      selectedCalendar: null
    });

    this.isWorking = true;
    this.calendarsService.getCalendars().subscribe(calendars => {
      this.calendars = calendars;
      this.isWorking = false;

      const parameters = this.parametersService.load();
      if (parameters == null) { return; }
      const selectedCalendar = calendars.filter(c => c.id === parameters.calendar.id)[0] || null;
      this.form = this.formBuilder.group({
        selectedCalendar: selectedCalendar
      });
    });
  }

  onSubmit() {
    const formModel = this.form.value;

    const parameter: IParameter = {
      calendar: formModel.selectedCalendar

    };
    this.parametersService.save(parameter);
    this.snackBar.open('Paramètres enregistrés');
  }
}
