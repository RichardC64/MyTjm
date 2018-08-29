import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ErrorStateMatcher, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IClient } from '@entities';
import { ClientsService } from '@services/datas';
import { TjmEventsService } from '@services/msgraph/outlook';

@Component({
  selector: 'app-new-tjm-event',
  templateUrl: './new-tjm-event.component.html'
})
export class NewTjmEventComponent implements OnInit {
  form: FormGroup;
  matcher = new ErrorStateMatcher();
  date: Date;
  clients: IClient[];
  positions = ['journée', 'matin', 'après-midi'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: NewTjmArgument,
    private dialogRef: MatDialogRef<NewTjmEventComponent>,
    private formBuilder: FormBuilder,
    private clientsService: ClientsService,
    private eventsService: TjmEventsService) {
    this.date = data.date;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      client: [null, [Validators.required]],
      cost: 0,
      isMorning: true,
      isAfternoon: true
    });

    this.clientsService.load().subscribe(cs => {
      this.clients = cs;
      this.form = this.formBuilder.group({
        client: [this.clients[0], [Validators.required]],
        cost: this.clients[0].tauxJournalier,
        isMorning: true,
        isAfternoon: true
      });
      this.form.get('client').valueChanges.subscribe(newValue => {
        this.form.patchValue({
          cost: newValue.tauxJournalier
        });
      });
    });

  }

  onSubmit() {
    if (this.form.invalid) { return; }
    const model = this.form.value;

    this.eventsService.createEvent(this.data.date, model.isMorning, model.isAfternoon, model.client, model.cost).subscribe(r => {
      this.dialogRef.close(true);
    });

  }

  cancel() {
    this.dialogRef.close(false);
  }

}

export class NewTjmArgument {
  date: Date;
}
