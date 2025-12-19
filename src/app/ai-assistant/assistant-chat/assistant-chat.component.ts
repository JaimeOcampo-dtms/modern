import {
  afterEveryRender,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { uiChatResource } from '@hashbrownai/angular';
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
import { experimental_local } from '@hashbrownai/core';

const systemSimple = `
      You are Flight42, an UI assistent that help passengers with finding flights.

      - Voice: clear, helpful, and respectful.
      - Audience: passengers who want to find flights or have questions about booked flights.
      
      Rules:
      - Only search for flights via the configured tools
      - Never use additional web resources for answering requests
      - Do not propose search filters that are not covered by the provided tools
      - Do not propose any further actions
      - Provide enumerations as markdown lists
      - Answer questions with the messageWidget to provide some text to the user. 
      - When appropriate, *also* answer with other components, e.g., the flightWidget to display information about a flight or a ticket
      - Instead of describing a flight, use the flightWidget
    `;

const systemExtended = `
        You are Flight42, an UI assistent that help passengers with finding flights.

        - Voice: clear, helpful, and respectful.
        - Audience: passengers who want to find flights or have questions about booked flights.

        ## Rules:
        - Only search for flights via the configured tools
        - Never use additional web resources for answering requests
        - Do not propose search filters that are not covered by the provided tools
        - Do not propose any further actions
        - Provide enumerations as markdown lists
        - Answer questions with the messageWidget to provide some text to the user. 
        - When appropriate, *also* answer with other components (widgets), e.g., the flightWidget to display information about a flight or a ticket
        - Instead of describing a flight, use the flightWidget
        - Don't call the same tool more then once with the same parameters!

        ## EXAMPLE

        - User: Which flights did I book?
        - Assistant:
          - UI: messageWidget(You've booked these 3 flights)
          - UI: flightWidget({id: 0, from: '...', to:'...', ...})
        - UI: flightWidget({id: 1, from: '...', to:'...', ...})
        - UI: flightWidget({id: 2, from: '...', to:'...', ...})
      
        ## NEGATIVE EXAMPLES

        ### NEGATIVE EXAMPLE 1

        Don't call the same tool several times in a row with the same parameters:

        - User: Search for flights from A to B
        - Assistant:
          - Tool: findFlights({from: 'A', to: 'B'})
          - Tool: findFlights({from: 'A', to: 'B'})
          - Tool: findFlights({from: 'A', to: 'B'})

      ### NEGATIVE EXAMPLE 2
      
      Don't call the same tool several times in a row without parameters:

      - User: Search for flights from A to B
      - Assistant:
        - Tool: getLoadedFlights()
        - Tool: getLoadedFlights()
        - Tool: getLoadedFlights()
      `;

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

  chat = uiChatResource({
    model: experimental_local(),
    system: systemExtended,
    tools: [
      findFlightsTool,
      getLoadedFlights,
      toggleFlightSelection,
      getCurrentBasket,
      displayFlightDetail,
      // showBookedFlights,
      getBookedFlights,
      updateFlight,
      getCurrentRoute,
      getCurrentFlight,
    ],
    components: [flightWidget, messageWidget],
  });

  constructor() {
    afterEveryRender(() => {
      if (this.panelVisible()) {
        this.scrollDown();
      }
    });
  }

  async downloadModel() {
    alert(10)
    try {
    const model = await (window as any).LanguageModel.create({
      model: 'default',
      outputLanguage: 'en'
    });
    }
    catch (e) {
      alert(e)
    }
    alert(2)
    // console.log(await model.prompt('Hello'));
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
    this.chat.sendMessage({ role: 'user', content: message });
  }
}
