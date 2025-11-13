import { inject } from '@angular/core';
import { createTool } from '@hashbrownai/angular';
import { FlightBookingStore } from '../../../flight-booking/flight-booking.store';

export const getCurrentBasket = createTool({
  name: 'getCurrentBasket',
  description: `
    Returns all selected flights (flights in the basket) as an object
    mapping flightIds to a boolean (true: selected, false: deselected)
  `,
  handler: () => {
    const store = inject(FlightBookingStore);
    return Promise.resolve(store.flightsValue());
  },
});
