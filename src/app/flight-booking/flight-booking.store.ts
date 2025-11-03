import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { FlightFilter } from './flight-filter';
import { withResource, withDevtools } from '@angular-architects/ngrx-toolkit';
import { httpResource } from '@angular/common/http';
import { Flight } from '../model/flight';
import { Subject } from 'rxjs';
import { FlightService } from './flight-search/flight.service';

export const BookingStore = signalStore(
  { providedIn: 'root' },
  withState({
    from: 'München',
    to: 'Hamburg',
    basket: {} as Record<number, boolean>,
  }),
  withComputed((store) => ({
    flightRoute: computed(() => store.from() + ' to ' + store.to()),
  })),
  withProps((store) => ({
    _flightService: inject(FlightService),
  })),
  withResource((store) => ({
    flights: store._flightService.findResource(store.from, store.to),
  })),
  withMethods((store) => ({
    updateFilter(filter: FlightFilter) {
      patchState(store, filter);
    },

    updateBasket(flightId: number, selected: boolean) {
      patchState(store, (state) => ({
        ...state,
        basket: {
          ...state.basket,
          [flightId]: selected,
        },
      }));
    },
  })),
  withDevtools('booking')
);
