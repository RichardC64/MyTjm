import { NewClientComponent } from './new-client.component';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { IClient } from '@entities';
import { ClientsService } from '@services/datas';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['../shared/shared.scss']
})
export class ClientsComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  clients: IClient[] = [];
  displayedColumns = ['edit', 'name', 'tauxJournalier', 'delete'];
  isWorking = false;
  selectedClient = new SelectionModel<IClient>(false, null);
  dataSource: MatTableDataSource<IClient>;



  constructor(
    private breakpointObserver: BreakpointObserver,
    private clientsService: ClientsService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.isWorking = true;
    this.clientsService.load().subscribe(cs => {
      this.clients = cs;
      this.isWorking = false;
    });
  }

  editRow(client: IClient) {

  }

  updateRow(client: IClient) {
    this.clientsService.updateClient(client).subscribe(result => {
      if (result != null) { this.clientsService.load().subscribe(cs => this.clients = cs); }
    });
  }

  cancelRow(client: IClient) {
    this.clientsService.load().subscribe(cs => this.clients = cs);
  }

  deleteRow(client: IClient) {
    this.clientsService.deleteClient(client).subscribe(result => {
      if (result != null) { this.clientsService.load().subscribe(cs => this.clients = cs); }
    });
  }

  newRow() {
    const dialogRef = this.matDialog.open(NewClientComponent);

    dialogRef.afterClosed().subscribe(client => {
      if (client == null) { return; }
      this.clientsService.load().subscribe(cs => this.clients = cs);
    });
  }
}
