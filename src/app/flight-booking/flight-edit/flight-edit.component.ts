import {
  Component,
  computed,
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
  Field,
  form,
} from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-flight-edit',
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    Field,
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

  isPending = this.store.saveFlightIsPending;
  saveFlightError = this.store.saveFlightError;

  showIndicator = computed(() => this.isLoading() || this.isPending());

  flightForm = form(this.flight);

  constructor() {
    this.store.updateFilter(this.id);
  }

  save(): void {
    this.store.saveFlight(this.flightForm().value());
  }
}

function normalize(flight: Flight): Flight {
  return {
    ...flight,
    date: toLocalDateTimeString(flight.date),
  };
}










/*
    submit(this.flightForm, async (form) => {
      const result = await this.store.saveFlight(form().value());

      if (result.status === 'error') {
        return {
          kind: 'server_error',
          error: result.error,
        };
      }
      return null;
    });
*/