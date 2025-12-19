import {
  afterEveryRender,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  uiChatResource,
} from '@hashbrownai/angular';
import { ChatMessages } from 'src/app/ai-assistant/chat-messages/chat-messages';
import { findFlightsTool } from './tools/find-flights.tool';
import { toggleFlightSelection } from './tools/toggle-flight-selection.tool';
import { getLoadedFlights } from './tools/get-loaded-flights.tool';
import { getCurrentBasket } from './tools/get-current-basket.tool';
import { displayFlightDetail } from './tools/display-flight-detail.tool';
import { getBookedFlights } from './tools/get-booked-flights.tool';
import { updateFlight } from './tools/update-flight.tool';
import { getCurrentFlight } from './tools/get-current-flight.tool';
import { getCurrentRoute } from './tools/get-current-route.tool';
import { config } from '../../config';
import { flightWidget } from './widgets/flight-widget';
import { messageWidget } from './widgets/message-widget';
import { Chat } from '@ai-sdk/angular';
import { HttpTransport } from '@hashbrownai/core';
import { DefaultChatTransport, HttpChatTransport, TextStreamChatTransport } from 'ai';

@Component({
  selector: 'app-assistant-chat',
  standalone: true,
  imports: [FormsModule, ChatMessages],
  templateUrl: './assistant-chat.component.html',
  styleUrls: ['./assistant-chat.component.css'],
})
export class AssistantChatComponent {
  composerInput = viewChild<ElementRef<HTMLInputElement>>('composerInput');
  messagesContainer =
    viewChild<ElementRef<HTMLDivElement>>('messagesContainer');

  panelVisible = signal(false);
  message = signal('');

  public chat: Chat = new Chat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:3000/api/chat',
    })
  });

  doStuff() {
    // this.chat.messages
  }

  // chat = uiChatResource({
  //   // model: 'gpt-5-chat-latest',
  //   // model: 'gpt-4.1',
  //   model: config.model,
  //   system: `
  //     You are Flight42, an UI assistent that help passengers with finding flights.

  //     - Voice: clear, helpful, and respectful.
  //     - Audience: passengers who want to find flights or have questions about booked flights.
      
  //     Rules:
  //     - Only search for flights via the configured tools
  //     - Never use additional web resources for answering requests
  //     - Do not propose search filters that are not covered by the provided tools
  //     - Do not propose any further actions
  //     - Provide enumerations as markdown lists
  //     - Answer questions with the messageWidget to provide some text to the user. 
  //     - When appropriate, *also* answer with other components, e.g., the flightWidget to display information about a flight or a ticket
  //     - Instead of describing a flight, use the flightWidget
  //   `,
  //   tools: [
  //     findFlightsTool,
  //     getLoadedFlights,
  //     toggleFlightSelection,
  //     getCurrentBasket,
  //     displayFlightDetail,
  //     // showBookedFlights,
  //     getBookedFlights,
  //     updateFlight,
  //     getCurrentRoute,
  //     getCurrentFlight,
  //   ],
  //   components: [flightWidget, messageWidget],
  // });

  constructor() {
    afterEveryRender(() => {
      if (this.panelVisible()) {
        this.scrollDown();
      }
    });
  }

  private scrollDown() {
    this.messagesContainer()?.nativeElement.scrollTo({
      top: this.messagesContainer()?.nativeElement.scrollHeight,
      behavior: 'smooth',
    });
  }

  toggle() {
    this.panelVisible.update((visible) => !visible);
    this.composerInput()?.nativeElement.focus();
  }

  submit() {
    const message = this.message();
    this.message.set('');
    this.chat.sendMessage({
      text: message
    });
  }
}
