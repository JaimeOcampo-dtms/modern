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
import { BookingStore } from '../booking.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FlightCardComponent, FormsModule],
})
export class FlightSearchComponent {


  store = inject(BookingStore);

  from = linkedSignal(() => this.store.from());
  to = linkedSignal(() => this.store.to());

  filter = computed(() => ({
    from: this.from(),
    to: this.to()
  }));

  flights = this.store.flightsValue;
  isLoading = this.store.flightsIsLoading;
  error = this.store.flightsError;

  basket = this.store.basket;

  search(): void {
    this.store.updateFilter(this.filter());
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.store.updateBasket(flightId, selected);
  }
}
