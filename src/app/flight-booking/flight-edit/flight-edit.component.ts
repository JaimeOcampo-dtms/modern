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

import {
  customError,
  FieldPath,
  form,
  submit,
  validate,
} from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { AircraftComponent } from './aircraft/aircraft.component';
import { FlightComponent } from './flight/flight.component';
import { PricesComponent } from './prices/prices.component';

@Component({
  selector: 'app-flight-edit',
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    AircraftComponent,
    PricesComponent,
    FlightComponent,
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

  loaded = computed(() => !this.error() && this.flight().id !== 0);

  flightForm = form(this.flight, flightSchema);

  constructor() {
    this.store.updateFilter(this.id);
  }

  async save() {
    // const result = await this.store.saveFlight(this.flightForm().value());

    // if (result.status === 'error') {
    //   console.error('error saving', result.error);
    // }

    await submit(this.flightForm, async (flightForm) => {
      const result = await this.store.saveFlight(flightForm().value());
      if (result.status === 'error') {
        const response = result.error as HttpErrorResponse;
        const error = response.error;

        return {
          kind: 'server_error',
          message: error,
        };
      }
      return null;
    });
  }
}

function validateCity(path: FieldPath<string>, allowedCities: string[]) {
  validate(path, (ctx) => {
    const from = ctx.value();
    // const to = ctx.valueOf(path.to)
    if (allowedCities.includes(from)) {
      return null;
    }
    return customError({
      kind: 'unsupported_city',
      message: 'This city is not supported',
      actual: from,
      allowed: allowedCities,
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
