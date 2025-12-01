import { inject } from '@angular/core';
import { createTool } from '@hashbrownai/angular';
import { FlightBookingStore } from '../../../flight-booking/flight-booking.store';

export const getLoadedFlights = createTool({
  name: 'getLoadedFlights',
  description: `
    Returns the currently loaded/ displayed flights.

    Remarks:
    - This tool is NOT displaying the list with these flights to the user
    - This list is useful to answer questions about the current working set
    - Use this tool when the user is asking for flights in general but not when they are asking for
      "booked flights", "tickets" or when they ask for checking in to a flight
  `,
  handler: () => {
    const store = inject(FlightBookingStore);
    return Promise.resolve(store.flightsValue());
  },
});
