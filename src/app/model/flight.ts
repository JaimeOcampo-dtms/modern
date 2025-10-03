import { apply, applyEach, applyWhenValue, disabled, min, minLength, required, schema } from "@angular/forms/signals";
import { Aircraft, aircraftSchema, initAircraft } from "./aircraft";
import { Price, priceSchema } from "./price";
import { validateCityAsync, validateCityHttp, validateDuplicatePrices, validateRoundTrip, validateRoundTripTree } from "../shared/validators";

export interface Flight {
  id: number;
  from: string;
  to: string;
  date: string;
  delayed: boolean;
  delay: number;
  aircraft: Aircraft;
  prices: Price[];
}

export const initFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delayed: false,
  aircraft: initAircraft,
  delay: 0,
  prices: [],
};

export const flightSchema = schema<Flight>((path) => {
  required(path.from, { message: 'Please enter a value!' });
  required(path.to);
  required(path.date);

  minLength(path.from, 3);
  
  //disabled(path.delay, (ctx) => !ctx.valueOf(path.delayed));
  disabled(path.delay, (ctx) => !ctx.valueOf(path.delayed) ? 'not delayed' : false);

  applyWhenValue(path, (flight) => flight.delayed, delayedFlight);

  validateDuplicatePrices(path.prices);

  validateCityAsync(path.from);
  validateCityHttp(path.to);

  validateRoundTrip(path);
  validateRoundTripTree(path);

  apply(path.aircraft, aircraftSchema);
  applyEach(path.prices, priceSchema);
});

export const delayedFlight = schema<Flight>((path) => {
  required(path.delay);
  min(path.delay, 15);
});