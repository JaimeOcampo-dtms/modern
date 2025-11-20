import {
  Component,
  inject,
  linkedSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightBookingStore } from '../flight-booking.store';
import { debounce, Field, form, minLength, required } from '@angular/forms/signals';
import { debounceSignal } from 'src/app/shared/debounce-signal';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FlightCardComponent, Field],
})
export class FlightSearchComponent {
  store = inject(FlightBookingStore);

  filter = linkedSignal(() => this.store.filter());

  flights = this.store.flightsValue;
  basket = this.store.basket;

  isLoading = this.store.flightsIsLoading;
  error = this.store.flightsError;

  filterForm = form(this.filter, (schema) => {
    // debounce(schema, 300);

    debounce(schema, (ctx, _abortSignal) => {
      return new Promise((resolve) => {
        console.log('value', ctx.value())
        console.log('pathKeys', ctx.pathKeys())
        setTimeout(resolve, 300);
      })
    });

    required(schema.from);
    minLength(schema.from, 3);
  });

  constructor() {
    this.store.reload();
    this.store.updateFilter(this.filterForm().value);
  }

  search(): void {
    this.store.reload();
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.store.updateBasket(flightId, selected);
  }
}
