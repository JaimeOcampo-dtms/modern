import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { createTool } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';
import { FlightBookingStore } from '../../../flight-booking/flight-booking.store';

export const findFlightsTool = createTool({
  name: 'findFlights',
  description: `
  Searches for flights and redirects the user to the result page where the found flights are shown.
  
  Remarks:
  - For the search parameters, airport codes are NOT used but the city name. First letter in upper case.
  `,
  schema: s.object('search parameters for flights', {
    from: s.string('airport of departure'),
    to: s.string('airport of destination'),
  }),
  handler: async (input) => {
    const store = inject(FlightBookingStore);
    const router = inject(Router);

    store.updateFilter({
      from: input.from,
      to: input.to,
    });

    router.navigate(['/flight-booking/flight-search']);
  },
});
