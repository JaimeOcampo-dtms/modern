import { computed, inject } from '@angular/core';
import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { FlightFilter } from './flight-filter';
import { withResource } from '@angular-architects/ngrx-toolkit';
import { httpResource } from '@angular/common/http';
import { Flight } from '../model/flight';
import { FlightService } from './flight-search/flight.service';

export const BookingStore = signalStore(
  { providedIn: 'root' },
  withState({
    from: 'Graz',
    to: 'Hamburg',
    basket: {} as Record<number, boolean>,
  }),
  withComputed((store) => ({
    flightRoute: computed(() => store.from() + ' - ' + store.to()),
  })),
  withProps(store => ({
    _flightService: inject(FlightService)
  })),
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
  withMethods((store) => ({
    updateFilter: signalMethod((filter: FlightFilter) => {
      patchState(store, filter);
    }),

    reload() {
        store._flightsReload();
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
