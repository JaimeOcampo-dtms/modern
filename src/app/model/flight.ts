import { applyWhenValue, disabled, min, minLength, required, schema } from "@angular/forms/signals";

export interface Flight {
  id: number;
  from: string;
  to: string;
  date: string;
  delayed: boolean;
  delay: number;
}

export const initFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delayed: false,
  delay: 0,
};

export const flightSchema = schema<Flight>((path) => {
  required(path.from, { message: 'Please enter a value!' });
  required(path.to);
  required(path.date);

  minLength(path.from, 3);
  
  disabled(path.delay, (ctx) => !ctx.valueOf(path.delayed) ? 'not delayed' : false);
  applyWhenValue(path, (flight) => flight.delayed, delayedFlight);
});

export const delayedFlight = schema<Flight>((path) => {
  required(path.delay);
  min(path.delay, 15);
});