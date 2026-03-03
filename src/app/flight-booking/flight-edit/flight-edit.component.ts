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
import { FormField, form, submit } from '@angular/forms/signals';
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

  saveFlightsError = this.store.saveFlightsError;
  saveFlightsPending = this.store.saveFlightsIsPending;

  flight = linkedSignal(() => normalize(this.store.flightValue()));
  error = this.store.flightError;
  isLoading = this.store.flightIsLoading;

  // TODO: Get Mutation and mutation state

  flightForm = form(this.flight);

  constructor() {
    this.store.updateFilter(this.id);
  }

  save(): void {
    submit(this.flightForm, {
      action: async (form) => {
        const result = await this.store.saveFlights(form().value());
        if (result.status === 'error') {
          return {
            kind: 'serverError',
            error: result.error
          }
        }
        return null;
      },
    });
    
  }
}

function normalize(flight: Flight): Flight {
  return {
    ...flight,
    date: toLocalDateTimeString(flight.date),
  };
}
