import { inject } from '@angular/core';
import { createTool } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';
import { FlightBookingStore } from '../../../flight-booking/flight-booking.store';
import { withToolResultGuard } from './tool-result.guard';

export const toggleFlightSelection = createTool({
  name: 'toggleFlightSelection',
  description: `
    Selects a flight or deselects it. Selected flights are added to the basket.
  `,
  schema: s.object('search parameters for flights', {
    flightId: s.number('id of flight to select or deselect'),
    selected: s.boolean('whether flight should be selected or deselected'),
  }),
  handler: withToolResultGuard('toggleFlightSelection', (input) => {
    const store = inject(FlightBookingStore);
    store.updateBasket(input.flightId, input.selected);
    return {
      status: 'ok',
      flightId: input.flightId,
      selected: input.selected,
    };
  }),
});
