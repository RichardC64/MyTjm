import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import {
  ErrorStateMatcher,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatSnackBar
} from '@angular/material';
import { IClient } from '@entities';
import { ClientsService } from '@services/datas';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['../shared/shared.scss']
})
export class NewClientComponent implements OnInit {
  form: FormGroup;
  matcher = new ErrorStateMatcher();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IClient,
    private dialogRef: MatDialogRef<NewClientComponent>,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private clientsService: ClientsService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      tauxJournalier: 500
    });
  }

  onSubmit() {
    if (this.form.invalid) { return; }
    const model = this.form.value;

    const client: IClient = {
      id: this.clientsService.newGuid(),
      name: model.name,
      tauxJournalier: model.tauxJournalier
    };
    this.clientsService.addClient(client).subscribe(result => {
      this.dialogRef.close(client);
    }, error => this.snackbar.open('Une erreur est survenue à la sauvegarde'));
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
