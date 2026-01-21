import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { FlightFilter } from './flight-filter';
import { withResource } from '@angular-architects/ngrx-toolkit';
import { httpResource } from '@angular/common/http';
import { Flight } from '../model/flight';

export const BookingStore = signalStore(
  { providedIn: 'root' },
  withState({
    from: 'Graz',
    to: 'Paris',
    basket: {} as Record<number, boolean>,
  }),
  withComputed((store) => ({
    flightRoute: computed(() => store.from() + ' - ' + store.to()),
  })),
  
  // TODO: Add Resource

  withMethods((store) => ({
    updateFilter(filter: FlightFilter) {
      patchState(store, filter);
    },

    reload() {
        // store._flightsReload();
    },

    updateBasket(flightId: number, selected: boolean) {
      patchState(store, (state) => ({
        basket: {
          ...state.basket,
          [flightId]: selected,
        },
      }));
    },
  }))
);











/*

withResource((store) => ({
    flights: httpResource<Flight[]>(
      () => ({
        url: 'https://demo.angulararchitects.io/api/flight',
        params: {
          from: store.from(),
          to: store.to(),
        },
      }),
      { defaultValue: [] }
    ),
  })),

*/