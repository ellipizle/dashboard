
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private subject = new Subject<any>();

  constructor(private dialog: MatDialog) { }

  setFormValue(form: any, invalidFlag, editedFlag) {
    this.subject.next({ data: form, invalidFlag: invalidFlag, editedFlag: editedFlag});
  }

  getFormValue(): any {
    return this.subject.asObservable();
  }

  openConfirmDialog(data) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      position: { top: '10px' },
      data: data
    });
  }
}
