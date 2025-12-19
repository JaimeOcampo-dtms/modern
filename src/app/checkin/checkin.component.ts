import {
  Component,
  inject,
  input,
  linkedSignal,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { structuredCompletionResource } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';
import { JsonPipe } from '@angular/common';

const confirmationSchema = s.object('Booking Confirmation', {
  firstName: s.string(`The passenger's first name`),
  lastName: s.string(`The passenger's last name`),
  bookingReference: s.string('The booking reference'),
});

type Confirmation = {
  firstName: string;
  lastName: string;
  bookingReference: string;
};

const initTicket: Confirmation = {
  firstName: '',
  lastName: '',
  bookingReference: '',
};

@Component({
  selector: 'app-checkin',
  imports: [FormsModule, JsonPipe],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.css',
})
export class CheckinComponent {
  dialog = inject(MatDialog);

  dialogMessage = viewChild<TemplateRef<unknown>>('dialogMessage');
  id = input.required<number>();

  input = signal<unknown>(undefined);

  ticketResource = structuredCompletionResource({
    schema: confirmationSchema,
    input: this.input,
    model: 'gpt-4o',
    system: `
    You extract booking information from images.
    Double check your results
    Return empty strings if data is missing.
  `,
  });

  loading = this.ticketResource.isLoading;
  error = this.ticketResource.error;

  ticket = linkedSignal<Confirmation>(
    () => this.ticketResource.value() ?? initTicket
  );

  checkin(): void {
    const message = this.dialogMessage();
    if (message) {
      this.dialog.open(message);
    }
  }

  close(): void {
    this.dialog.closeAll();
  }

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.selectedFile = file;

    // Preview erzeugen
    const previewUrl = await read(file);
    this.previewUrl = previewUrl;

    await this.sendConfirmation(previewUrl);
  }

  private async sendConfirmation(base64Image: string) {
    this.input.set({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Describe exactly what you see in this image.',
            },
            {
              type: 'image',
              image: base64Image,
            },
          ],
        },
      ],
    });
  }
}

function read(file: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}
