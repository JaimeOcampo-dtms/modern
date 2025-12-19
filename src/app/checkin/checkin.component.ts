import {
  Component,
  inject,
  input,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { StructuredObject } from '@ai-sdk/angular';
import z from 'zod';
import { FormsModule } from '@angular/forms';

const ticketSchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      bookingReference: z.string(),
    });

type Ticket = z.infer<typeof ticketSchema>;

const initTicket: Ticket = {
  firstName: '',
  lastName: '',
  bookingReference: ''
};

@Component({
  selector: 'app-checkin',
  imports: [FormsModule],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.css',
})
export class CheckinComponent {
  dialog = inject(MatDialog);

  dialogMessage = viewChild<TemplateRef<unknown>>('dialogMessage');
  id = input.required<number>();

  error = signal<string | undefined>(undefined);
  ticket = signal<Ticket>(initTicket)

  loading = signal<boolean>(false);

  objectReader = new StructuredObject({
    api: 'http://localhost:3000/api/passport',
    schema: ticketSchema,
    onFinish: (result) => {
      this.loading.set(false);
      console.log('finish', result);
      if (result.error) {
        this.error.set(String(result.error));
      }
      else if (result.object) {
        this.ticket.set(result.object);
      }
    }
  });

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

    this.loading.set(true);
    await this.sendConfirmation(previewUrl);
  }

  private async sendConfirmation(base64Image: string) {
    await this.objectReader.submit({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'read the detail from this image?',
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
