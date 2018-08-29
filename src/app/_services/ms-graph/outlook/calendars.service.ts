import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphBaseService } from '@services/msgraph';
import { HttpClient } from '@angular/common/http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalendarsService extends GraphBaseService {

  constructor(httpClient: HttpClient) { super(httpClient); }

  /**Liste des calendriers du user connecté */
  getCalendars(): Observable<MicrosoftGraph.Calendar[]> {
    return this.getClientArray<MicrosoftGraph.Calendar>('me/calendars', 'name, color, canEdit, owner, events')
      .pipe(map(r => r.value));
  }
}
