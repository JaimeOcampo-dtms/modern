import {
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight } from 'src/app/model/flight';
import { BookingStore } from '../flight-booking.store';
import {
  customError,
  Field,
  FieldPath,
  form,
  minLength,
  required,
  schema,
  validate,
} from '@angular/forms/signals';
import { FlightFilter } from '../flight-filter';

const FlightSchema = schema<FlightFilter>((path) => {
  required(path.from);
  minLength(path.from, 3);
  const allowed = ['Graz', 'Hamburg', 'Berlin'];
  validateCity(path.from, allowed);
});

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FlightCardComponent, Field],
})
export class FlightSearchComponent {
  store = inject(BookingStore);

  from = this.store.from;
  to = this.store.to;

  criteria = linkedSignal(() => ({
    from: this.from(),
    to: this.to(),
  }));

  searchForm = form(this.criteria, FlightSchema);

  flights = this.store.flightsValue;
  error = this.store.flightsError;
  isLoading = this.store.flightsIsLoading;

  basket = this.store.basket;

  search(): void {
    this.store.reload();
    this.store.updateFilter(this.searchForm().value());
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.store.updateBasket(flightId, selected);
  }
}

function validateCity(path: FieldPath<string>, allowed: string[]) {
  validate(path, (ctx) => {
    const value = ctx.value();
    if (allowed.includes(value)) {
      return null;
    }

    return customError({
      kind: 'invalid_city',
      actual: value,
      allowed: allowed,
    });
  });
}
