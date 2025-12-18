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
  form,
  required,
  submit,
  schema,
  apply,
  Field,
} from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceSignal } from '../../shared/debounce-signal';
import { Flight, flightSchema } from '../../model/flight';
import { toLocalDateTimeString } from '../../utils/date';
import { AircraftComponent } from './aircraft/aircraft.component';
import { PricesComponent } from './prices/prices.component';
import { FlightComponent } from './flight/flight.component';
import { ValidationErrorsComponent } from 'src/app/shared/validation-errors/validation-errors.component';

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
    // AircraftComponent,
    // PricesComponent,
    // FlightComponent,
  ],
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css'],
})
export class FlightEditComponent {
  private store = inject(FlightDetailStore);

  flight = computed(() => normalize(this.store.flightValue()));

  // TODO: add flight to form

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

function normalize(flight: Flight): Flight {
  return {
    ...flight,
    date: toLocalDateTimeString(flight.date),
  };
}
