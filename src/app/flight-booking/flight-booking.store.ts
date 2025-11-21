import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { FlightFilter } from './flight-filter';

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
 
  // TODO: Add Resource!

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
