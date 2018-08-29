import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export const GraphUrl = 'https://graph.microsoft.com/v1.0/';

export class GraphBaseService {
  constructor(
    protected httpClient: HttpClient) { }

  protected getClient<T>(api: string, select: string = null, args: string = null): Observable<T> {
    const queryParams = [];
    if (select) { queryParams.push('$select=' + select); }
    if (args) { queryParams.push(args); }
    const url = GraphUrl + api + '?' + queryParams.join('&');
    return this.httpClient.get<T>(url);
  }

  protected getClientArray<T>(api: string, select: string = null, args: string[] = null): Observable<ArrayResponse<T>> {
    let queryParams = [];
    if (select) { queryParams.push('$select=' + select); }
    if (args) { queryParams = queryParams.concat(args); }

    const url = GraphUrl + api + '?' + queryParams.join('&');
    const headers = new HttpHeaders()
      .set('prefer', 'outlook.timezone=\"Europe/Paris\"');
    return this.httpClient.get<ArrayResponse<T>>(url, { headers: headers });
  }
}

export class ArrayResponse<T> {
  value: T[];
}

export interface ISingleValueExtendedPropertiesOwner {
  singleValueExtendedProperties: MicrosoftGraph.SingleValueLegacyExtendedProperty[];
}
