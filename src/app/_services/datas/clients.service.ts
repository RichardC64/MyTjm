import { Injectable } from '@angular/core';
import { IClient } from '@entities';
import { FilesService } from '@services/msgraph/onedrive';
import { of, Observable } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

const ClientsKey = 'myTjm_clients';
const ClientsFileName = 'clients.json';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private filesService: FilesService) { }

  public checkUpdates() {
    this.filesService.getLastModifiedDateTime(ClientsFileName).subscribe(r => r);
  }
  public load(): Observable<IClient[]> {
    return this.filesService.loadFile(ClientsFileName).pipe(
      mergeMap(content => {
        const clients = <IClient[]>content;
        this.saveLocal(clients);
        return of(clients);
      }),
      catchError(err => {
        const localDatas: IClient[] = <IClient[]>JSON.parse(localStorage.getItem(ClientsKey));
        return of(localDatas);
      })
    );
  }

  public addClient(client: IClient): Observable<boolean> {
    return this.load().pipe(
      mergeMap(clients => {
        if (clients == null) { clients = []; }
        clients.push(client);
        return this.save(clients);
      }),
      map(cs => cs != null)
    );
  }

  public updateClient(client: IClient): Observable<boolean> {
    return this.load().pipe(
      mergeMap(clients => {
        if (clients == null) { return of(null); }
        const existingClient = clients.filter(c => c.id === client.id)[0] || null;
        if (existingClient == null) { return of(null); }
        const index = clients.indexOf(existingClient);
        clients[index] = client;
        return this.save(clients);
      }),
      map(cs => {
        return cs != null;
      })
    );
  }

  public deleteClient(client: IClient): Observable<boolean> {

    return this.load().pipe(
      mergeMap(clients => {
        if (clients == null) { return of(null); }
        const existingClient = clients.filter(c => c.id === client.id)[0] || null;
        if (existingClient == null) { return of(null); }
        const index = clients.indexOf(existingClient);
        clients.splice(index, 1);
        return this.save(clients);
      }),
      map(cs => cs != null)
    );
  }

  private save(clients: IClient[]): Observable<any> {
    this.saveLocal(clients);
    return this.filesService.saveFile(ClientsFileName, JSON.stringify(clients));
  }

  private saveLocal(clients: IClient[]) {
    localStorage.setItem(ClientsKey, JSON.stringify(clients));
  }

  newGuid(): string {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  private s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}
