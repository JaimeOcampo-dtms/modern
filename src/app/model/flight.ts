import { min, minLength, required, schema } from "@angular/forms/signals";
import { Aircraft, initAircraft } from "./aircraft";
import { Price } from "./price";
import { validateCityAsync, validateCityHttp, validateRoundTrip, validateRoundTripTree } from "../shared/validators";

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

  // validateCity(path.from, ['Graz', 'London']);

  validateRoundTrip(path);
  validateRoundTripTree(path);

  validateCityAsync(path.from);
  validateCityHttp(path.to);

  // TODO: Standard Schema
  
  // TODO: applyWhenValue
  // TODO: disabled

  // TODO: aircraftSchema
  // TODO: priceSchema
  // TODO: duplicate prices

});

export const delayedFlight = schema<Flight>((path) => {
  required(path.delay);
  min(path.delay, 15);
});






/*
  disabled(path.delay, (ctx) => !ctx.valueOf(path.delayed));
  applyWhenValue(path, (flight) => flight.delayed, delayedFlight);


  apply(path.aircraft, aircraftSchema);
  applyEach(path.prices, priceSchema);

  validateDuplicatePrices(path.prices);
*/