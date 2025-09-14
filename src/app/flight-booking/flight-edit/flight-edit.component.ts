import {
  Component,
  inject,
  input,
  linkedSignal,
  numberAttribute,
} from '@angular/core';

import { FlightDetailStore } from '../flight-detail.store';
import { Control, form, required, submit, apply } from '@angular/forms/signals';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { debounceSignal } from '../../shared/debounce-signal';
import { Flight, FlightSchema } from '../../model/flight';
import { toLocalDateTimeString } from '../../utils/date';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-flight-edit',
  imports: [
    Control,
    JsonPipe,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css'],
})
export class FlightEditComponent {
  private store = inject(FlightDetailStore);

  id = input.required({
    transform: numberAttribute,
  });

  // TODO: Get from store
  isPending = debounceSignal(this.store.saveFlightIsPending, 300);
  error = this.store.saveFlightError;

  flight = linkedSignal(() => normalize(this.store.flightValue()));
  flightForm = form(this.flight, (schema) => {
    required(schema.from);
    required(schema.to);
    required(schema.date);

    apply(schema, FlightSchema['~validate'])
  });

  constructor() {
    this.store.updateFilter(this.id);
  }

  save(): void {
    submit(this.flightForm, async (form) => {
      const result = await this.store.saveFlight(form().value());

      if (result.status === 'error') {
        alert(1);
        return {
          kind: 'processing_error',
          // ^^^ try to be more specfic
          error: result.error,
        };
      }
      return null;
    });
  }
}

function normalize(flight: Flight): Flight {
  return flight;
}
