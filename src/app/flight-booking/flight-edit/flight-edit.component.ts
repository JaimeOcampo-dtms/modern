import {
  Component,
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
  FieldTree,
  FieldState,
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
    AircraftComponent,
    PricesComponent,
    FlightComponent,
    ValidationErrorsComponent,
  ],
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css'],
})
export class FlightEditComponent {
  private store = inject(FlightDetailStore);

  id = input.required({
    transform: numberAttribute,
  });

  isPending = debounceSignal(this.store.saveFlightIsPending, 300);
  error = this.store.saveFlightError;

  flight = linkedSignal(() => normalize(this.store.flightValue()));
  flightForm = form(this.flight, flightSchema);

  constructor() {
    this.store.updateFilter(this.id);
  }

  save(): void {
    submit(this.flightForm, async (form) => {
      const result = await this.store.saveFlight(form().value());

      if (result.status === 'error') {
        return {
          kind: 'processing_error',
          error: result.error,
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
