import { Injectable } from '@angular/core';
import { GraphBaseService, ISingleValueExtendedPropertiesOwner, GraphUrl } from '@services/msgraph';
import { HttpClient } from '@angular/common/http';
import { IClient, ITjmEventData, ITjmEvent, DayPosition } from '@entities';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParametersService } from '@services/datas';

import * as moment from 'moment-timezone';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

const MyTjmProperty = 'String {7F477958-DE03-4B4F-89FC-284980AF6C92} Name MyTjmProperties';

@Injectable({
  providedIn: 'root'
})
export class TjmEventsService extends GraphBaseService {

  constructor(
    httpClient: HttpClient,
    private parametersService: ParametersService) {
    super(httpClient);
  }

  getEvents(startDate: moment.Moment, endDate: moment.Moment): Observable<ITjmEvent[]> {
    const parameters = this.parametersService.load();

    const url = parameters == null ?
      'me/calendarView' :
      '/me/calendars/' + parameters.calendar.id + '/calendarView';

    return this.getClientArray<MicrosoftGraph.Event>(
      url,
      null,
      [
        'startdatetime=' + startDate.toISOString(),
        'enddatetime=' + endDate.toISOString(),
        '$expand=singleValueExtendedProperties($filter= id eq \'' + MyTjmProperty + '\')',
        '$top=100'
      ]).pipe(
        map(r => {
          const result: ITjmEvent[] = [];
          r.value.forEach(item => {
            const tjmDatas = this.getTjmDatas(item);
            if (item != null && tjmDatas != null) {

              result.push({
                outlookEvent: item,
                datas: tjmDatas
              });
            }
          });
          return result;
        })
      );
  }

  private getTjmDatas(event: any): ITjmEventData {
    const instance = event as ISingleValueExtendedPropertiesOwner;
    if (instance == null) { return null; }
    const props = instance.singleValueExtendedProperties;
    if (props == null || props.length === 0 || props[0].value == null) { return null; }

    return <ITjmEventData>JSON.parse(props[0].value);
  }

  deleteEvent(id: string) {
    const parameters = this.parametersService.load();

    const url = parameters == null ?
      GraphUrl + 'me/events/' + id :
      GraphUrl + '/me/calendars/' + parameters.calendar.id + '/events/' + id;

    return this.httpClient.delete(url);
  }

  createEvent(date: Date, isMorning: boolean, isAfternoon: boolean, client: IClient, cost: number) {
    const tjmEventMorning: ITjmEventData = !isMorning ? null : {
      client: client,
      cost: cost / 2,
      dayPosition: DayPosition.morning
    };

    const tjmEventAfternoon: ITjmEventData = !isAfternoon ? null : {
      client: client,
      cost: cost / 2,
      dayPosition: DayPosition.afternoon
    };

    const tjmMorningObservable = !tjmEventMorning ?
      null :
      this.createEventImpl(moment(date).hour(9).toDate(), moment(date).hour(12).minute(30).toDate(), tjmEventMorning);

    const tjmAfternoonObservable = !tjmEventAfternoon ?
      null :
      this.createEventImpl(moment(date).hour(14).toDate(), moment(date).hour(18).toDate(), tjmEventAfternoon);

    if (isMorning && isAfternoon) {
      return forkJoin(tjmMorningObservable, tjmAfternoonObservable);
    } else if (isMorning) {
      return tjmMorningObservable;
    } else if (isAfternoon) {
      return tjmAfternoonObservable;
    }
  }

  private createEventImpl(startDate: Date, endDate: Date, tjmEvent: ITjmEventData) {
    const parameters = this.parametersService.load();

    // on utilise le calendrier par défaut ou le calendrier spécifié dans les paramètres
    const url = parameters == null ?
      'me/events' :
      GraphUrl + '/me/calendars/' + parameters.calendar.id + '/events';

      // on est en France que diable !
    const body = {
      subject: tjmEvent.client.name,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Europe/Paris'
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Europe/Paris'
      },
      isReminderOn: false,
      categories: ['myTjm'],
      singleValueExtendedProperties: [{
        id: MyTjmProperty,
        value: JSON.stringify(tjmEvent) // les données JSON sérialisées
      }
      ]
    };
    return this.httpClient.post(url, body);
  }
}
