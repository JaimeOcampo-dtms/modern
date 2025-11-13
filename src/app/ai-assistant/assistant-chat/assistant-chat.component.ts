import {
  afterEveryRender,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { chatResource } from '@hashbrownai/angular';
import { ChatMessages } from 'src/app/ai-assistant/chat-messages/chat-messages';
import { findFlightsTool } from './tools/find-flights.tool';
import { toggleFlightSelection } from './tools/toggle-flight-selection.tool';
import { getLoadedFlights } from './tools/get-loaded-flights.tool';
import { getCurrentBasket } from './tools/get-current-basket.tool';
import { displayFlightDetail } from './tools/display-flight-detail.tool';
import { showBookedFlights } from './tools/show-booked-flights.tool';
import { getBookedFlights } from './tools/get-booked-flights.tool';
import { updateFlight } from './tools/update-flight.tool';
import { getCurrentFlight } from './tools/get-current-flight.tool';
import { getCurrentRoute } from './tools/get-current-route.tool';

@Component({
  selector: 'app-assistant-chat',
  standalone: true,
  imports: [FormsModule, ChatMessages],
  templateUrl: './assistant-chat.component.html',
  styleUrls: ['./assistant-chat.component.css'],
})
export class AssistantChatComponent {
  composerInput = viewChild<ElementRef<HTMLInputElement>>('composerInput');

  panelVisible = signal(false);
  message = signal('');

  chat = chatResource({
    model: 'gpt-5-chat-latest',
    system: `
      You are Flight42, an UI assistent that help passengers with finding flights.

      - Voice: clear, helpful, and respectful.
      - Audience: passengers who want to find flights or have questions about booked flights.
      
      Rules:
      - Only search for flights via the configured tools
      - Never use additional web resources for answering requests
      - Do not propose search filters that are not covered by the provided tools
      - Do not propose any further actions
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
      getCurrentFlight,
    ],
  });

  constructor() {
    afterEveryRender(() => {
      this.composerInput()?.nativeElement.focus();
    });
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
