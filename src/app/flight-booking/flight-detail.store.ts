import {
  patchState,
  signalMethod,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  httpMutation,
  rxMutation,
  withMutations,
  withResource,
} from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FlightService } from './flight-search/flight.service';
import { Flight } from '../model/flight';

export const FlightDetailStore = signalStore(
  { providedIn: 'root' },
  
  withState({
    filter: {
      id: 0,
    },
  }),

  withProps(() => ({
    _flightService: inject(FlightService),
    _snackBar: inject(MatSnackBar),
  })),

  withResource((store) => ({
    flight: store._flightService.findResourceById(store.filter.id),
  })),

  // TODO: Add Mutation
  withMutations((store) => ({
    saveFlight: httpMutation({
      request: (flight: Flight) => ({
        url: 'https://demo.angulararchitects.io/api/flight/' + flight.id,
        method: 'PUT',
        body: flight
      }),
      onSuccess() {
        store._snackBar.open('Saved flight', 'OK');
      },
      onError() {
        store._snackBar.open('Error saving flight', 'OK');
      }
    })
  })),   

  withMethods((store) => ({
    updateFilter: signalMethod((id: number) => {
      if (id !== store.filter.id()) {
        patchState(store, {
          filter: {
            id,
          },
        });
      }
    }),
  }))
);
