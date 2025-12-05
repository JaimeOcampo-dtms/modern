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
    criteria: computed(() => ({
        from: store.from(),
        to: store.to()
    }))
  })),
 
  withProps((store) => ({
    _flightService: inject(FlightService)
  })),

  // TODO: Add Resource!
  withResource((store) => ({
    flights: store._flightService.findResource(store.criteria)
  })),

  withMethods((store) => ({
    updateFilter(filter: FlightFilter) {
      patchState(store, filter);
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
