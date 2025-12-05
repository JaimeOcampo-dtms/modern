import { s } from "@hashbrownai/core";
import { Flight } from "src/app/model/flight";

export interface FlightInfo extends Omit<Flight, 'delayed'> {
  status: 'booked' | 'other';
  delayInfo: 'delayed' | 'in time';
}

export const FlightInfoSchema = s.object('Flight to be displayed', {
  id: s.number('the flight id'),
  from: s.string('Departure city. No code but the city name'),
  to: s.string('Arrival city. No code but the city name'),
  date: s.string('Departure date in ISO format'),
  delay: s.number('If delayed, this represents the delay in minutes'),
  status: s.enumeration(`Whether the flight is booked or not. 
    ## Rules
    - Infere this value from the context of the conversation. 
    - A flight can only have the status 'booked' when it was retrieved via the tool 'getBookedFlights'. 
`, [
    'booked',
    'other',
  ]),
  delayInfo: s.enumeration('Whether the flight is delayed or in time. Infere this value from the delayed flag of the flight.', [
    'delayed',
    'in time',
  ]),
});
