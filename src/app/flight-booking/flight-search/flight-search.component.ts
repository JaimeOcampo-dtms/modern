import {
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { BookingStore } from '../flight-booking.store';
import {
  FormField,
  debounce,
  form,
  minLength,
  required,
  schema,
} from '@angular/forms/signals';
import { FlightFilter } from '../flight-filter';
import { delegatedSignal } from 'src/app/utils/delegated-signal';

const FlightSchema = schema<FlightFilter>((path) => {
  required(path.from);
  minLength(path.from, 3);

  debounce(path.from, 300);
  debounce(path.to, 300);
});

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FlightCardComponent, FormField],
})
export class FlightSearchComponent {
  store = inject(BookingStore);

  from = this.store.from;
  to = this.store.to;

  criteria = delegatedSignal(
    () => ({
      from: this.from(),
      to: this.to(),
    }),
    (value) => {
      this.store.updateFilter(value);
    }
  );

  searchForm = form(this.criteria, FlightSchema);

  flights = this.store.flightsValue;
  isLoading = this.store.flightsIsLoading;
  error = this.store.flightsError;

  basket = this.store.basket;

  search(): void {
    this.store.reload();
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.store.updateBasket(flightId, selected);
  }
}
