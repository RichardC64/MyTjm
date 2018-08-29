import { Injectable } from '@angular/core';
import { GraphBaseService, GraphUrl } from '@services/msgraph';
import { HttpClient } from '@angular/common/http';
import { mergeMap, map } from 'rxjs/operators';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class FilesService extends GraphBaseService {

  constructor(httpClient: HttpClient) { super(httpClient); }

  loadFile(fileName: string) {
    const url = GraphUrl + '/me/drive/root:/myTjm/' + fileName + ':/?select=@microsoft.graph.downloadUrl';
    return this.httpClient.get(url)
      .pipe(
        mergeMap(result => {

          const downloadUrl = result['@microsoft.graph.downloadUrl'];
          return this.httpClient.get(downloadUrl);
        }));
  }

  saveFile(fileName: string, content: string) {
    const url = GraphUrl + '/me/drive/root:/myTjm/' + fileName + ':/content';
    return this.httpClient.put(url, content);
  }

  getLastModifiedDateTime(fileName: string) {
    const url = GraphUrl + '/me/drive/root:/myTjm/' + fileName + ':/?select=fileSystemInfo';
    return this.httpClient.get(url)
      .pipe(
        map(result => moment(result['fileSystemInfo']['lastModifiedDateTime'])));
  }
}
