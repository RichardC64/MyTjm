import { Injectable } from '@angular/core';
import { GraphBaseService } from '@services/msgraph';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GraphBaseService {

  constructor(httpClient: HttpClient) { super(httpClient); }

  getMe(): Observable<MicrosoftGraph.User> {
    return this.getClient<MicrosoftGraph.User>('me', 'displayName,mail,userPrincipalName');
  }
}
