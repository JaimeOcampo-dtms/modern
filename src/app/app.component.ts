import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { NextFlightsModule } from './next-flights/next-flights.module';
import { ConfigService } from './shared/config.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { chatResource, createTool } from '@hashbrownai/angular';
import { FormsModule } from '@angular/forms';
import { ChatMessages } from './ai-assistent/chat-messages';
import { s } from '@hashbrownai/core';
import { FlightBookingStore } from './flight-booking/flight-booking.store';
import { NextFlightsService } from './next-flights/next-flights.service';
import { lastValueFrom } from 'rxjs';
import { FlightDetailStore } from './flight-booking/flight-detail.store';

export const AircraftSchema = s.object('Aircraft', {
  type: s.string('Aircraft type e.g. A320'),
  registration: s.string('Tail number'),
});

export const PriceSchema = s.object('Price information', {
  flightClass: s.string('Class name'),
  amount: s.number('Amount of the price'),
});

export const FlightUpdateSchema = s.object('Flight to be displayed', {
  from: s.anyOf([
    s.nullish(),
    s.string('Departure city. No code but the city name'),
  ]),
  to: s.anyOf([
    s.nullish(),
    s.string('Arrival city. No code but the city name'),
  ]),
  date: s.anyOf([s.nullish(), s.string('Departure date in ISO format')]),
  delayed: s.anyOf([s.nullish(), s.boolean('Flight delayed status')]),
});

type FlightUpdate = {
  from: string | null;
  to: string | null;
  date: string | null;
  delayed: boolean | null;
};

const findFlightsTool = createTool({
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
  handler: (input) => {
    const store = inject(FlightBookingStore);
    const router = inject(Router);

    store.updateFilter({
      from: input.from,
      to: input.to,
    });

    router.navigate(['/flight-booking/flight-search']);
    return Promise.resolve();
  },
});

const toggleFlightSelection = createTool({
  name: 'toggleFlightSelection',
  description: `
    Selects a flight or deselects it. Selected flights are added to the basket.
  `,
  schema: s.object('search parameters for flights', {
    flightId: s.number('id of flight to select or deselect'),
    selected: s.boolean('whether flight should be selected or deselected'),
  }),
  handler: (input) => {
    const store = inject(FlightBookingStore);
    store.updateBasket(input.flightId, input.selected);
    return Promise.resolve();
  },
});

const getLoadedFlights = createTool({
  name: 'getLoadedFlights',
  description: `
    Returns the currently loaded/ displayed flights.

    Remarks:
    - This tool is NOT displaying the list with these flights to the user
    - This list is useful to answer questions about the current working set
  `,
  handler: () => {
    const store = inject(FlightBookingStore);
    return Promise.resolve(store.flightsValue());
  },
});

const getCurrentBasket = createTool({
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

const displayFlightDetail = createTool({
  name: 'displayFlightDetail',
  description: `
    Routes to the detail of a flight. This detail view can be used to edit the flight.
  `,
  schema: s.object('parameter objekt', {
    flightId: s.number('flightId of the flight to display'),
  }),
  handler: (input) => {
    const router = inject(Router);
    router.navigate(['/flight-booking/flight-edit', input.flightId]);
    return Promise.resolve();
  },
});

const showBookedFlights = createTool({
  name: 'showBookedFlights',
  description: `
    Displays the upcoming booked flights (aka next flights) of the current user.
    This view is used for check-in.
  `,
  handler: () => {
    const router = inject(Router);
    router.navigate(['/next-flights']);
    return Promise.resolve();
  },
});

const getBookedFlights = createTool({
  name: 'showBookedFlights',
  description: `
    Displays the upcoming booked flights (aka next flights) of the current user.
    This view is used for check-in.
  `,
  handler: () => {
    const service = inject(NextFlightsService);
    const nextFlights = service.load();
    return lastValueFrom(nextFlights);
  },
});

const updateFlight = createTool({
  name: 'updateFlight',
  description: `
    Updates the flight currently displayed in the detail form.
    For instance, this tool can be used to set the delayed flag or to update the flight date.

    Remarks:
    - Only pass the flight properties you want to update
    - This tool can ONLY be used when the current route is /flight-booking/flight-edit
  `,
  schema: s.object('parameter objekt', {
    flight: FlightUpdateSchema,
  }),
  handler: (input) => {
    const store = inject(FlightDetailStore);
    const flightUpdate = toPartialFlight(input.flight);    
    store.updateLocalFlight(flightUpdate);
    return Promise.resolve();
  },
});

const getCurrentRoute = createTool({
  name: 'getCurrentRoute',
  description: `
    returns the current route path as a string
  `,
  handler: () => {
    const router = inject(Router);
    return Promise.resolve(router.url);
  },
});

@Component({
  imports: [
    SidebarComponent,
    NavbarComponent,
    NextFlightsModule,
    RouterOutlet,
    FormsModule,
    ChatMessages,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  configService = inject(ConfigService);
  panelVisible = signal(false);

  message = signal('');

  chat = chatResource({
    model: 'gpt-4.1',
    system: `
      You are Flight42, an UI assistent that help passengers with finding flights.

      - Voice: clear, helpful, and respectful.
      - Audience: passengers who want to find flights or have questions about booked flights.
      
      Rules:
      - Only search for flights via the configured tools
      - Never use additional web resources for answering requests
      - Do not propose search filters that are not covered by the provided tools
    `,
    tools: [
      findFlightsTool,
      getLoadedFlights,
      toggleFlightSelection,
      getCurrentBasket,
      displayFlightDetail,
      showBookedFlights,
      getBookedFlights,
      updateFlight,
      getCurrentRoute,
    ],
  });

  constructor() {
    // TODO: In a later lab, we will assure that
    //  loading did happen _before_ we use the config!
    this.configService.loadConfig();

    // effect(() => {
    //   debugger;
    //   console.log('effect', this.chat.value());
    // })
  }

  retryMessages() {
    // this.chat.resendMessages();
  }

  toggle() {
    this.panelVisible.update((visible) => !visible);
  }

  submit() {
    const message = this.message();
    this.message.set('');
    this.chat.sendMessage({ role: 'user', content: message });
  }
}
function toPartialFlight(flight: FlightUpdate) {
  return Object.fromEntries(
    Object.entries(flight).filter(([_, value]) => value != null)
  );
}

