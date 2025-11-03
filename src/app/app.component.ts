import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { NextFlightsModule } from './next-flights/next-flights.module';
import { ConfigService } from './shared/config.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { chatResource, exposeComponent, uiChatResource } from '@hashbrownai/angular';
import { prompt } from '@hashbrownai/core';
import { FormsModule } from '@angular/forms';
import { ChatMessages } from './ai-assistent/chat-messages';
import { FlightCardComponent } from './flight-booking/flight-card/flight-card.component';
import { s } from '@hashbrownai/core';


export const AircraftSchema = s.object('Aircraft', {
  type: s.string('Aircraft type e.g. A320'),
  registration: s.string('Tail number')
});

export const PriceSchema = s.object('Price information', {
  flightClass: s.string('Class name'),
  amount: s.number('Amount of the price')
});

export const FlightSchema = s.object('Flight to be displayed', {
  id: s.number('Unique flight ID'),
  from: s.string('Departure IATA code'),
  to: s.string('Arrival IATA code'),
  date: s.string('Departure date in ISO format'),
  delayed: s.boolean('Flight delayed status'),
  delay: s.number('Delay in minutes'),
  aircraft: AircraftSchema,
  prices: s.array('Available prices', PriceSchema)
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
  title = 'Hello World!';

  configService = inject(ConfigService);
  panelVisible = signal(false);

  message = signal('');

  chat = chatResource({
    model: 'gpt-4.1',
    system: `
      You are Flight42, an UI assistent that help passengers with finding flights.

      - Voice: clear, helpful, and respectful.
      - Audience: passengers who want to find flights or have questions about booked flights.
    `,
  });

  
  constructor() {
    // TODO: In a later lab, we will assure that
    //  loading did happen _before_ we use the config!
    this.configService.loadConfig();
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
