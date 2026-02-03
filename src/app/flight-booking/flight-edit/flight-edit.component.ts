import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  numberAttribute,
} from '@angular/core';

import { FlightDetailStore } from '../flight-detail.store';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Flight } from '../../model/flight';
import { toLocalDateTimeString } from '../../utils/date';
import {
  FormField,
  form,
  minLength,
  required,
  submit,
} from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-flight-edit',
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormField,
    JsonPipe,
  ],
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css'],
})
export class FlightEditComponent {
  private store = inject(FlightDetailStore);

  id = input.required({
    transform: numberAttribute,
  });

  flight = linkedSignal(() => normalize(this.store.flightValue()));
  error = this.store.flightError;
  isLoading = this.store.flightIsLoading;

  // TODO: Get Mutation and mutation state
  saveFlight = this.store.saveFlight;
  saveFlightError = this.store.saveFlightError;
  saveFlightIsPending = this.store.saveFlightIsPending;

  flightForm = form(this.flight, (path) => {
    required(path.from);
    minLength(path.from, 3);
  });

  constructor() {
    this.store.updateFilter(this.id);
  }

  save(): void {
    submit(this.flightForm, async (form) => {
      const result = await this.saveFlight(form().value());

      if (result.status === 'error') {
        return {
          kind: 'server_error',
          message: (result.error as any).error,
        };
      }

      return null;
    });
  }
}

function normalize(flight: Flight): Flight {
  return {
    ...flight,
    date: toLocalDateTimeString(flight.date),
  };
}
