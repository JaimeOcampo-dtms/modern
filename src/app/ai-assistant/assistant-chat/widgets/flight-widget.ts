import { exposeComponent } from '@hashbrownai/angular';
import { FlightWidgetComponent } from './flight-widget.component';
import { FlightSchema } from './flight-schema';
import { s } from '@hashbrownai/core';

export const flightWidget = exposeComponent(FlightWidgetComponent, {
  name: 'flightWidget',
  description: `
    Displays a flight or flight ticket. Use this instead of textual descriptions of flights or tickets.
    
    ## Rules
    - Make sure to correctly infer the status for the passed FlightInfo ('booked' vs. 'other').
    - A flight has the status 'booked' **only**  when retrieved via the tool 'getBookedFlights'.
    
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
    flight: FlightSchema,
    status: s.enumeration(
      `
      Whether the flight is booked or not. 

      ## Rules
      - Infere this value from the context of the conversation. 
      - A flight can only have the status 'booked' when it was retrieved via the tool 'getBookedFlights'. 
      `,
      ['booked', 'other']
    ),
  },
});
