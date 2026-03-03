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
import { withResource } from '@angular-architects/ngrx-toolkit';
import { httpResource } from '@angular/common/http';
import { Flight } from '../model/flight';
import { rxResource } from '@angular/core/rxjs-interop';
import { FlightService } from './flight-search/flight.service';

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

  withProps(() => ({
    _flightService: inject(FlightService),
  })),

  withResource(
    (store) => ({
      flights: store._flightService.findResource(store.from, store.to)
    }),
    { errorHandling: 'previous value' }
  ),

  withMethods((store) => ({
    updateFilter(filter: FlightFilter) {
      patchState(store, filter);
    },

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
