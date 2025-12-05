import {
  Component,
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
import { Field, form, required,  } from '@angular/forms/signals';

@Component({
  selector: 'app-flight-edit',
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    Field
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

  flightForm = form(this.flight, (path) => {
    required(path.from);
    required(path.to);
    required(path.date);
    required(path.id);
  });

  pending = this.store.saveFlightIsPending;
  error = this.store.saveFlightError;


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
    date: toLocalDateTimeString(flight.date)
  }
}
