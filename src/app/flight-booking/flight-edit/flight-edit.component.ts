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

@Component({
  selector: 'app-flight-edit',
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormField,
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

  flightForm = form(this.flight, (path) => {
    // validateStandardSchema(path, /*flightZodSchema*/);
  });

  constructor() {
    effect(() => {
      console.log('flight', this.flight());
    })
    this.store.updateFilter(this.id);
  }

  save(): void {

    submit(this.flightForm, async (form) => {
      const result = await this.store.saveFlight(form().value());

      if (result.status === 'error') {
        return {
          kind: 'server_error',
          error: result.error
        }
      }
      return null;
    });

  }
}

function normalize(flight: Flight): Flight {
  return {
    ...flight,
    date: toLocalDateTimeString(flight.date)
  }
}
