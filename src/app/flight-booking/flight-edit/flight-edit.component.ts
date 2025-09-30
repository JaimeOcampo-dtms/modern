import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  numberAttribute,
} from '@angular/core';

import { FlightDetailStore } from '../flight-detail.store';
import {
  FieldPath,
  form,
  minLength,
  required,
  submit,
  validate,
  ValidationSuccess,
  validateAsync,
  validateTree,
  customError,
  validateHttp,
  schema,
  apply,
  min,
  applyEach,
  applyWhenValue,
  disabled,
  property,
  aggregateProperty,
} from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceSignal } from '../../shared/debounce-signal';
import { Flight } from '../../model/flight';
import { toLocalDateTimeString } from '../../utils/date';
import { delay, map, Observable, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Aircraft } from 'src/app/model/aircraft';
import { Price } from 'src/app/model/price';
import { AircraftComponent } from './aircraft/aircraft.component';
import { PricesComponent } from './prices/prices.component';
import { FlightComponent } from './flight/flight.component';
import { ValidationErrorsComponent } from 'src/app/shared/validation-errors/validation-errors.component';
import { CITY, CITY2 } from 'src/app/shared/properties';

export const aircraftSchema = schema<Aircraft>((path) => {
  required(path.registration);
  required(path.type);
});

export const priceSchema = schema<Price>((path) => {
  required(path.flightClass);
  required(path.amount);
  min(path.amount, 0);
});

export const delayedFlight = schema<Flight>((path) => {
  required(path.delay);
  min(path.delay, 15);
});

export const flightSchema = schema<Flight>((path) => {
  // required(path.from, { message: 'Please enter a value!' });
  required(path.from, { message: 'Please enter a value!' });
  required(path.to);
  required(path.date);

  minLength(path.from, 3);
  // validateCity(schema.from, ['Graz', 'Hamburg', 'Zürich']);

  // validate(path.to, (ctx) => {
  //   if (ctx.value() === ctx.valueOf(path.from)) {
  //     return customError({ kind: 'roundtrip'})
  //   }
  //   return null;
  // })

  // applyWhen(path, (ctx) => ctx.valueOf(path.delayed), delayedFlight);
  disabled(path.delay, (ctx) => !ctx.valueOf(path.delayed));
  applyWhenValue(path, (flight) => flight.delayed, delayedFlight);

  // required(path.delay, {
  //   when: (ctx) => ctx.valueOf(path.delayed)
  // });

  validateDuplicatePrices(path.prices);

  validateCityAsync(path.from);
  validateCityHttp(path.from);

  validateCityAsync(path.to);

  validateRoundTrip(path);
  validateRoundTripTree(path);

  apply(path.aircraft, aircraftSchema);
  applyEach(path.prices, priceSchema);
});

export const flightFormSchema = schema<Flight>((path) => {
  apply(path, flightSchema);
  required(path.id);
});

@Component({
  selector: 'app-flight-edit',
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    AircraftComponent,
    PricesComponent,
    FlightComponent,
    ValidationErrorsComponent,
  ],
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css'],
})
export class FlightEditComponent {
  private store = inject(FlightDetailStore);

  id = input.required({
    transform: numberAttribute,
  });

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
}

function validateCity(path: FieldPath<string>, allowed: string[]) {
  validate(path, (ctx) => {
    const value = ctx.value();
    if (allowed.includes(value)) {
      return null as ValidationSuccess;
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

function validateCityAsync(schema: FieldPath<string>) {
  aggregateProperty(schema, CITY2, () => true);
  property(schema, CITY, () => true);

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

function validateCityHttp(schema: FieldPath<string>) {

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

function normalize(flight: Flight): Flight {
  return {
    ...flight,
    date: toLocalDateTimeString(flight.date),
  };
}
