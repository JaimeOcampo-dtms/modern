import { apply, applyEach, applyWhen, applyWhenValue, disabled, hidden, min, minLength, property, readonly, required, schema, validateStandardSchema } from "@angular/forms/signals";
import { Aircraft, aircraftSchema, initAircraft } from "./aircraft";
import { Price, priceSchema } from "./price";
import { validateCityAsync, validateCityHttp, validateDuplicatePrices, validateRoundTrip, validateRoundTripTree } from "../shared/validators";
import { FlightSchema } from "./standard-schema";
import { CITY } from "../shared/properties";

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

  validateStandardSchema(path, FlightSchema);

  applyWhenValue(path, (flight) => flight.delayed, delayedFlight);
  // applyWhen(path, (ctx) => ctx.valueOf(path.delayed) , delayedFlight);

  disabled(path.delay, (ctx) => !ctx.valueOf(path.delayed) ? 'because it is not delayed!' : false)

  // disabled(path.delay, (ctx) => !ctx.valueOf(path.delayed))
  // readonly(path.delay, (ctx) => !ctx.valueOf(path.delayed))
  // hidden(path.delay, (ctx) => !ctx.valueOf(path.delayed))

  applyEach(path.prices, priceSchema);
  validateDuplicatePrices(path.prices);

  apply(path.aircraft, aircraftSchema);

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