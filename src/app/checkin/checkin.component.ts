import {
  Component,
  inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-checkin',
  imports: [],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.css',
})
export class CheckinComponent {
  dialog = inject(MatDialog);

  dialogMessage = viewChild<TemplateRef<unknown>>('dialogMessage');

  id = input.required<number>();

  checkin(): void {
    const message = this.dialogMessage();
    if (message) {
      this.dialog.open(message);
    }
  }

  close(): void {
    this.dialog.closeAll();
  }
}
