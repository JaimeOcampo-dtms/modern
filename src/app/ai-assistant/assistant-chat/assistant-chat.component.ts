import {
  afterEveryRender,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatMessages } from 'src/app/ai-assistant/chat-messages/chat-messages';
import { Chat } from '@ai-sdk/angular';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai';
import { FlightBookingStore } from 'src/app/flight-booking/flight-booking.store';
import { NextFlightsService } from 'src/app/next-flights/next-flights.service';
import { lastValueFrom } from 'rxjs';

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

  bookingStore = inject(FlightBookingStore);
  nextFlightsService = inject(NextFlightsService);

  public chat: Chat = new Chat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:3000/api/chat',
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall: async ({ toolCall }) => {
      if (toolCall.dynamic) {
        return;
      }

      if (toolCall.toolName === 'getLoadedFlightsTool') {
        this.chat.addToolOutput({
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          output: this.bookingStore.flightsValue(),
        });
      }

      if (toolCall.toolName === 'toggleFlightSelectionTool') {
        const input = toolCall.input as { flightId: number; selected: boolean };

        this.bookingStore.updateBasket(input.flightId, input.selected);

        this.chat.addToolOutput({
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          output: 'ok',
        });
      }

      if (toolCall.toolName === 'getBookedFlightsTool') {
        const nextFlights = this.nextFlightsService.load();
        const result = await lastValueFrom(nextFlights);

        this.chat.addToolOutput({
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          output: result,
        });
      }

      if (toolCall.toolName === 'findFlightsTool') {
        const input = toolCall.input as { from: string; to: string };

        this.bookingStore.updateFilter(input)

        this.chat.addToolOutput({
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          output: 'ok',
        });
      }
    },
  });

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
      text: message,
    });
  }
}
