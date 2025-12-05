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
import { FormsModule } from '@angular/forms';
import { BookingStore } from '../flight-booking.store';
import { Field, form, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FlightCardComponent, FormsModule, Field],
})
export class FlightSearchComponent {

  store = inject(BookingStore);
  
  from = this.store.from;
  to = this.store.to;

  filter = linkedSignal(() => ({
    from: this.from(),
    to: this.to(),
    aircraft: {
      type: '',
      regNum: '',
    },
    layovers: [
      { airport: 'FRA', duration: 40 }
    ]
  }))

  searchForm = form(this.filter, (path) => {
    required(path.from);
    minLength(path.from, 3);
  });


  flights = this.store.flightsValue;
  isLoading = this.store.flightsIsLoading;
  error = this.store.flightsError;

  basket = signal<Record<number, boolean>>({});


  search(): void {
    this.store.updateFilter(this.filter());
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.store.updateBasket(flightId, selected);
  }
}
