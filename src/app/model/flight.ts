import { applyWhenValue, disabled, min, minLength, required, schema } from "@angular/forms/signals";

export interface Flight {
  id: number;
  from: string;
  to: string;
  date: string;
  delay: number;
}

export const initFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delay: 0,
};

export const flightSchema = schema<Flight>((path) => {
  required(path.from, { message: 'Please enter a value!' });
  required(path.to);
  required(path.date);

  minLength(path.from, 3);
  
});

export const delayedFlight = schema<Flight>((path) => {
  required(path.delay);
  min(path.delay, 15);
});