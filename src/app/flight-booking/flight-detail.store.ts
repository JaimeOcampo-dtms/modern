import {
  patchState,
  signalMethod,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  withResource,
  withMutations,
  httpMutation,
  rxMutation,
  concatOp,
  mergeOp
} from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FlightService } from './flight-search/flight.service';
import { Subject } from 'rxjs';
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
  }), { errorHandling: 'previous value' }),

  // TODO: Add Mutation

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


















/*

withMutations((store) => ({

    saveFlight: httpMutation({
      request: (flight: Flight) => ({
        url: 'https://demo.angulararchitects.io/api/flight/' + flight.id,
        method: 'PUT',
        body: flight,
      }),
      onError(error) {
        console.error('error', error);
        store._snackBar.open('Error saving flight!', 'OK');
      },
      onSuccess() {
        store._snackBar.open('Flight saved!', 'OK');
      }
    })

  })),

*/