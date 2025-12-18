import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  numberAttribute,
} from '@angular/core';

import { FlightDetailStore } from '../flight-detail.store';
import {
  required,
  schema,
  apply,
  form,
  Field,
  minLength,
  validate,
  SchemaPath,
} from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceSignal } from '../../shared/debounce-signal';
import { Flight, flightSchema } from '../../model/flight';
import { toLocalDateTimeString } from '../../utils/date';
import { JsonPipe } from '@angular/common';
import { AircraftComponent } from './aircraft/aircraft.component';
import { FlightComponent } from './flight/flight.component';
import { PricesComponent } from './prices/prices.component';

export const flightFormSchema = schema<Flight>((path) => {
  apply(path, flightSchema);
  required(path.id);
});

@Component({
  selector: 'app-flight-edit',
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    AircraftComponent,
    PricesComponent,
    FlightComponent,
    Field,
    JsonPipe
  ],
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css'],
})
export class FlightEditComponent {
  private store = inject(FlightDetailStore);

  flight = linkedSignal(() => normalize(this.store.flightValue()));

  // TODO: add flight to form

  flightForm = form(this.flight, flightSchema);

  id = input.required({
    transform: numberAttribute,
  });

  isPending = debounceSignal(this.store.saveFlightIsPending, 300);
  error = this.store.saveFlightError;

  constructor() {
    this.store.updateFilter(this.id);
  }

  save(): void {
    // TODO: Write server error back to signal form
    this.store.saveFlight(this.flight());
  }
}

function validateCity(path: SchemaPath<string>, allowed: string[]) {
  validate(path, (ctx) => {
    const value = ctx.value();
    if (allowed.includes(value)) {
      return null;
    }

    return {
      kind: 'unsupported_city',
      value,
      allowed,
    };
  });
}

function normalize(flight: Flight): Flight {
  return {
    ...flight,
    date: toLocalDateTimeString(flight.date),
  };
}
