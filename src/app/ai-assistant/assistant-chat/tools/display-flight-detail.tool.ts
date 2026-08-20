import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { createTool } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';
import { withToolResultGuard } from './tool-result.guard';

export const displayFlightDetail = createTool({
  name: 'displayFlightDetail',
  description: `
    Routes to the detail of a flight. This detail view can be used to edit the flight.
  `,
  schema: s.object('parameter objekt', {
    flightId: s.number('flightId of the flight to display'),
  }),
  handler: withToolResultGuard('displayFlightDetail', async (input) => {
    const router = inject(Router);
    await router.navigate(['/flight-booking/flight-edit', input.flightId]);
    return {
      status: 'ok',
      flightId: input.flightId,
      route: `/flight-booking/flight-edit/${input.flightId}`,
    };
  }),
});
