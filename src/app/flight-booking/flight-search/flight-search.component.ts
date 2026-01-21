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
  form,
  minLength,
  required,
  schema,
} from '@angular/forms/signals';
import { FlightFilter } from '../flight-filter';
import { Flight } from 'src/app/model/flight';

const FlightSchema = schema<FlightFilter>((path) => {
  required(path.from);
  minLength(path.from, 3);
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

  criteria = linkedSignal(() => ({
    from: this.from(),
    to: this.to(),
  }));

  searchForm = form(this.criteria, FlightSchema);

  // TODO: Get state from store
  flights = signal<Flight[]>([]);

  basket = this.store.basket;

  search(): void {
    this.store.updateFilter(this.searchForm().value());
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.store.updateBasket(flightId, selected);
  }
}

