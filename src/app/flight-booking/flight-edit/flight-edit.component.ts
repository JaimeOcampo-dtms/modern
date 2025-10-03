import {
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

import { FlightDetailStore } from '../flight-detail.store';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Flight } from '../../model/flight';
import { formatDate } from '../../utils/date';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-flight-edit',
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    JsonPipe,
    // AircraftComponent,
    // PricesComponent,
    // FlightComponent,
    // ValidationErrorsComponent,
  ],
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css'],
})
export class FlightEditComponent {
  private store = inject(FlightDetailStore);

  id = input.required({
    transform: numberAttribute,
  });

  flight = this.store.flightValue;
  error = this.store.flightError;

  loaded = computed(() => !this.error() && this.flight().id !== 0);

  constructor() {
    this.store.updateFilter(this.id);
  }

  save(): void {
    // TODO
  }
}

// format date for <input type="datetime-local" ...>
function normalize(flight: Flight): Flight {
  return {
    ...flight,
    date: formatDate(flight.date),
  };
}
