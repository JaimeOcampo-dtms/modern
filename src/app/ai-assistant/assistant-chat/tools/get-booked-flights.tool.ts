import { inject } from '@angular/core';
import { createTool } from '@hashbrownai/angular';
import { lastValueFrom } from 'rxjs';
import { NextFlightsService } from '../../../next-flights/next-flights.service';

export const getBookedFlights = createTool({
  name: 'getBookedFlights',
  description: `
    Returns the booked flights (aka next flights) of the current user.
    Only use this when the user explicitly asks for booked flights, tickets or checking in to a flight.
  `,
  handler: async () => {
    const service = inject(NextFlightsService);
    const nextFlights = service.load();
    const result = lastValueFrom(nextFlights);
    return result;
  },
});
