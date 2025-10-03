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
import { Flight, flightSchema } from '../../model/flight';
import { formatDate } from '../../utils/date';
import { JsonPipe } from '@angular/common';
import {
  Control,
  customError,
  FieldPath,
  form,
  MIN_LENGTH,
  minLength,
  required,
  schema,
  submit,
  validate,
} from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { FlightComponent } from "./flight/flight.component";
import { PricesComponent } from "./prices/prices.component";
import { AircraftComponent } from "./aircraft/aircraft.component";

@Component({
  selector: 'app-flight-edit',
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    JsonPipe,
    Control,
    FlightComponent,
    PricesComponent,
    AircraftComponent
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

  flightForm = form(this.flight, flightSchema);

  loaded = computed(() => !this.error() && this.flight().id !== 0);

  constructor() {
    this.store.updateFilter(this.id);
  }

  // Discount Validation
  async save(): Promise<void> {
    await submit(this.flightForm, async (flightForm) => {
      const result = await this.store.saveFlight(flightForm().value());
      if (result.status === 'error') {
        const response = result.error as HttpErrorResponse;
        return {
          kind: 'server_side_error',
          message: response.error,
        };
      }
      return null;
    });
  }
}

function validateCity(path: FieldPath<string>, allowedCitites: string[]) {
  validate(path, (ctx) => {
    const city = ctx.value();

    if (allowedCitites.includes(city)) {
      return null;
    }

    return customError({
      kind: 'not_supported_city',
      message: 'This city is not supported!',
      actual: city,
      allowed: allowedCitites,
    });
  });
}

// format date for <input type="datetime-local" ...>
function normalize(flight: Flight): Flight {
  return {
    ...flight,
    date: formatDate(flight.date),
  };
}
