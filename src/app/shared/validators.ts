import { rxResource } from '@angular/core/rxjs-interop';
import {
  customError,
  FieldPath,
  validate,
  validateAsync,
  validateHttp,
  validateTree,
  ValidationSuccess,
} from '@angular/forms/signals';
import { Observable, of, delay, map } from 'rxjs';
import { Flight } from '../model/flight';
import { Price } from '../model/price';

export function validateCity(path: FieldPath<string>, allowed: string[]) {
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

export function validateRoundTrip(schema: FieldPath<Flight>) {
  validate(schema, (ctx) => {
    const from = ctx.field.from().value();
    const to = ctx.field.to().value();

    if (from === to) {
      return customError({
        kind: 'roundtrip',
        from,
        to,
      });
    }
    return null;
  });
}

export function validateRoundTripTree(schema: FieldPath<Flight>) {
  validateTree(schema, (ctx) => {
    const from = ctx.field.from().value();
    const to = ctx.field.to().value();

    if (from === to) {
      return [
        {
          kind: 'roundtrip_tree',
          field: ctx.field.from,
          from,
          to,
        },
        {
          kind: 'roundtrip_tree',
          field: ctx.field.to,
          from,
          to,
        },
      ];
    }
    return null;
  });
}

export function validateCityAsync(schema: FieldPath<string>) {
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

// Simulates a serverside validation
function rxValidateAirport(airport: string): Observable<boolean> {
  const allowed = ['Graz', 'Hamburg', 'Zürich'];
  return of(null).pipe(
    delay(2000),
    map(() => allowed.includes(airport))
  );
}

export function validateCityHttp(schema: FieldPath<string>) {
  validateHttp(schema, {
    request: (ctx) => ({
      url: 'https://demo.angulararchitects.io/api/flight',
      params: {
        from: ctx.value(),
      },
    }),
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

export function validateDuplicatePrices(prices: FieldPath<Price[]>) {
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

//
//  aggregateProperty(schema, CITY2, () => true);
//  property(schema, CITY, () => true);
//
