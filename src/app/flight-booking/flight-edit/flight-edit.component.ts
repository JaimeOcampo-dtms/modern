import {
  Component,
  inject,
  input,
  linkedSignal,
  numberAttribute,
} from '@angular/core';

import { FlightDetailStore } from '../flight-detail.store';
import {
  Control,
  FieldPath,
  form,
  minLength,
  PathKind,
  required,
  submit,
  validate,
  validateAsync,
  validateTree,
  customError,
  validateHttp,
  schema,
  apply,
  min,
  applyEach,
} from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceSignal } from '../../shared/debounce-signal';
import { Flight } from '../../model/flight';
import { toLocalDateTimeString } from '../../utils/date';
import { JsonPipe } from '@angular/common';
import { delay, map, Observable, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Aircraft } from 'src/app/model/aircraft';
import { initPrice, Price } from 'src/app/model/price';

export const aircraftSchema = schema<Aircraft>((path) => {
  required(path.registration);
  required(path.type);
});

export const priceSchema = schema<Price>((path) => {
  required(path.flightClass);
  required(path.amount);
  min(path.amount, 0);
});

export const flightSchema = schema<Flight>((path) => {
  required(path.from);
  required(path.to);
  required(path.date);

  minLength(path.from, 3);

  // validateCity(schema.from, ['Graz', 'Hamburg', 'Zürich']);
  validateCityRemote(path.from);
  validateCityHttp(path.from);

  validateRoundTrip(path);
  validateRoundTripTree(path);

  validateDuplicatePrices(path.prices);

  apply(path.aircraft, aircraftSchema);
  applyEach(path.prices, priceSchema);
});

@Component({
  selector: 'app-flight-edit',
  imports: [
    Control,
    JsonPipe,
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css'],
})
export class FlightEditComponent {
  private store = inject(FlightDetailStore);

  id = input.required({
    transform: numberAttribute,
  });

  // TODO: Get from store
  isPending = debounceSignal(this.store.saveFlightIsPending, 300);
  error = this.store.saveFlightError;

  flight = linkedSignal(() => normalize(this.store.flightValue()));

  flightForm = form(this.flight, flightSchema);

  constructor() {
    this.store.updateFilter(this.id);
  }

  save(): void {
    submit(this.flightForm, async (form) => {
      const result = await this.store.saveFlight(form().value());

      if (result.status === 'error') {
        return {
          kind: 'processing_error',
          // ^^^ try to be more specfic
          error: result.error,
        };
      }
      return null;
    });
  }

  addPrice(): void {
    this.flightForm
      .prices()
      .value.update((prices) => [...prices, { ...initPrice }]);
  }
}

function validateDuplicatePrices(prices: FieldPath<Price[]>) {
  validate(prices, (ctx) => {
    const prices = ctx.value();
    const flightClasses = new Set<string>();

    for (const price of prices) {
      if (flightClasses.has(price.flightClass)) {
        return customError({
          kind: 'duplicateFlightClass',
          message: 'There can only be one price per flight class',
          flightClass: price.flightClass,
        });
      }
      flightClasses.add(price.flightClass);
    }

    return null;
  });
}

function validateCity(path: FieldPath<string>, allowed: string[]) {
  validate(path, (ctx) => {
    const value = ctx.value();
    if (allowed.includes(value)) {
      return null;
    }

    return customError({
      kind: 'city',
      value,
      allowed,
    });
  });
}

function validateRoundTripTree(schema: FieldPath<Flight>) {
  validateTree(schema, (ctx) => {
    const from = ctx.field.from().value();
    const to = ctx.field.to().value();

    if (from === to) {
      return {
        kind: 'roundtrip_tree',
        field: ctx.field.from,
        from,
        to,
      };
    }
    return null;
  });
}

function validateRoundTrip(schema: FieldPath<Flight>) {
  validate(schema, (ctx) => {
    const from = ctx.field.from().value();
    const to = ctx.field.to().value();

    if (from === to) {
      return customError({
        kind: 'roundtrip',
        target: ctx.field.from,
        from,
        to,
      });
    }
    return null;
  });
}

function validateCityRemote(schema: FieldPath<string>) {
  validateAsync(schema, {
    params: (ctx) => ({
      value: ctx.value(),
    }),
    factory: (params) => {
      return rxResource({
        params,
        stream: (p) => {
          return rxValidateAirport(p.params.value);
        },
      });
    },
    errors: (result, ctx) => {
      if (!result) {
        return {
          kind: 'airport_not_found',
        };
      }
      return null;
    },
  });
}

function validateCityHttp(schema: FieldPath<string, PathKind.Root>) {
  validateHttp(schema, {
    request: (ctx) => ({
      url: 'https://demo.angulararchitects.io/api/flight',
      params: {
        from: ctx.value(),
      },
    }),
    // options: {
    //   parse: raw => raw as Flight[]
    // },
    errors: (result: Flight[], ctx) => {
      if (result.length === 0) {
        return {
          kind: 'airport_not_found_http',
        };
      }
      return null;
    },
  });
}

// Simulates a serverside validation
function rxValidateAirport(airport: string): Observable<boolean> {
  const allowed = ['Graz', 'Hamburg', 'Zürich'];
  return of(null).pipe(
    delay(2000),
    map(() => allowed.includes(airport))
  );
}

function normalize(flight: Flight): Flight {
  return {
    ...flight,
    date: toLocalDateTimeString(flight.date),
  };
}
