import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from "@ngrx/signals";
import { FlightFilter } from "./flight-filter";
import { withResource, withDevtools } from "@angular-architects/ngrx-toolkit";
import { httpResource } from "@angular/common/http";
import { Subject } from "rxjs";
import { FlightService } from "./flight-search/flight.service";

export const BookingStore = signalStore(
    { providedIn: 'root'},
    withState({
        from: 'Graz',
        to: 'London',
        basket: {} as Record<number, boolean>
    }),
    withComputed((store) => ({
        flightRoute: computed(() => store.from() + ' to ' + store.to()),
        criteria: computed(() => ({
            from: store.from(),
            to: store.to(),
        })),
    })),
    // withEncapsulation({ internal: 'flightService' })
    withProps(() => ({
        flightService: inject(FlightService)
    })),
    withResource((store) => ({
        flights: store.flightService.createResource(store.criteria),
    })),
    withMethods((store) => ({

        updateFilter(filter: FlightFilter): void {
            patchState(store, filter);
        },
        updateBasket(flightId: number, selected: boolean): void {

            patchState(store, (state) => ({
                ...state,
                basket: {
                    ...state.basket,
                    [flightId]: selected,
                    //12: true
                }
            }))

        }

    })),
    withDevtools('booking'),
);