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
import { FormsModule } from '@angular/forms';
import { form, minLength, required, validateStandardSchema } from '@angular/forms/signals';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FlightCardComponent, FormsModule],
})
export class FlightSearchComponent {

  store = inject(BookingStore);

  from = this.store.from;
  to = this.store.to;

  filter = linkedSignal(() => ({
    from: this.from(),
    to: this.to(),
  }));

  filterForm = form(this.filter, (path) => {
    required(path.from);
    minLength(path.from, 3);
  });

  flights = this.store.flightsValue;
  error = this.store.flightsError;
  isLoading = this.store.flightsIsLoading;

  basket = this.store.basket;

  search(): void {
    console.log('this.filter()', this.filter())
    this.store.updateFilter(this.filter());
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.store.updateBasket(flightId, selected);
  }
}
