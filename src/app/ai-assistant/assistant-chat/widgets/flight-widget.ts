import { exposeComponent } from '@hashbrownai/angular';
import { FlightWidgetComponent } from './flight-widget.component';
import { FlightInfoSchema } from './flight-info';

export const flightWidget = exposeComponent(FlightWidgetComponent, {
  name: 'flightWidget',
  description: `
    Displays a flight or flight ticket. Use this instead of textual descriptions of flights or tickets.
    
    Make sure to correctly infer the status for the passed FlightInfo ('booked' vs. 'other').
    A booked flight is **only** retrieved via the tool 'getBookedFlights'.
    
    ## Example for infering a status 'booked'
    - User: Which flights did I book?
    - Assistant:
        - Tool: getBookedFlights()
        - UI: flightWidget({flightInfo: { id: 0, ..., status: 'booked' }})

    ## Example for infering a status 'other'
    - User: Which of the found flights is the earliest one?
    - Assistant:
        - Tool: getLoadedFlights()
        - UI: flightWidget({flightInfo: { id: 0, ..., status: 'other' }})
`,
  input: {
    flightInfo: FlightInfoSchema,
  },
});
