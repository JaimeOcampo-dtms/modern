import { inject } from '@angular/core';
import { createTool } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';
import { firstValueFrom } from 'rxjs';
import { FlightService } from '../../../flight-booking/flight-search/flight.service';
import { withToolResultGuard } from './tool-result.guard';

export const loadFlightsForRoutes = createTool({
  name: 'loadFlightsForRoutes',
  description: `
    Loads flights for multiple routes in one tool call.

    Use this tool for requests that mention several city pairs
    or "return flights".

    Rules:
    - Provide a single JSON object as input
    - Put all route pairs into the routes array
    - Do not pass several top-level JSON objects separated by commas
  `,
  schema: s.object('Multiple route pairs to search', {
    routes: s.array(
      'Route pairs',
      s.object('Single route pair', {
        from: s.string('Departure city. First letter in upper case.'),
        to: s.string('Arrival city. First letter in upper case.'),
      })
    ),
  }),
  handler: withToolResultGuard('loadFlightsForRoutes', async (input) => {
    const service = inject(FlightService);

    const uniqueRoutes = input.routes.filter(
      (route, index, routes) =>
        routes.findIndex((r) => r.from === route.from && r.to === route.to) ===
        index
    );

    const grouped = await Promise.all(
      uniqueRoutes.map(async (route) => ({
        from: route.from,
        to: route.to,
        flights: await firstValueFrom(service.find(route.from, route.to)),
      }))
    );

    return {
      routes: grouped,
      totalFlights: grouped.reduce((acc, item) => acc + item.flights.length, 0),
    };
  }),
});
