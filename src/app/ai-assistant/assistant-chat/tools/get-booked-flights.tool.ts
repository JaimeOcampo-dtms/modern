import { inject } from '@angular/core';
import { createTool } from '@hashbrownai/angular';
import { lastValueFrom } from 'rxjs';
import { NextFlightsService } from '../../../next-flights/next-flights.service';

export const getBookedFlights = createTool({
  name: 'getBookedFlights',
  description: `
    Returns the booked flights (aka next flights) of the current user.
  `,
  handler: () => {
    const service = inject(NextFlightsService);
    const nextFlights = service.load();
    return lastValueFrom(nextFlights);
  },
});
