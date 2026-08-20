import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { createTool } from '@hashbrownai/angular';
import { withToolResultGuard } from './tool-result.guard';

export const showBookedFlights = createTool({
  name: 'showBookedFlights',
  description: `
    Displays the upcoming booked flights (aka next flights) of the current user.
    This view is used for check-in.
  `,
  handler: withToolResultGuard('showBookedFlights', async () => {
    const router = inject(Router);
    await router.navigate(['/next-flights']);
    return {
      status: 'ok',
      route: '/next-flights',
      message: 'Booked flights view opened.',
    };
  }),
});
