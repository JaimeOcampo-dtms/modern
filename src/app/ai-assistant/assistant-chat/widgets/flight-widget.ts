import { exposeComponent } from '@hashbrownai/angular';
import {
  FlightWidgetComponent,
} from './flight-widget.component';
import { FlightInfoSchema } from './flight-info';

export const flightWidget = exposeComponent(FlightWidgetComponent, {
  description:
    'Displays a flight or flight ticket. Use this instead of textual descriptions.',
  input: {
    flightInfo: FlightInfoSchema,
  },
});
