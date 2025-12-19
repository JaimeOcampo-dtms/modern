import { Component, computed, effect, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


import { MatTooltipModule } from '@angular/material/tooltip';
import { MessageComponent } from 'src/app/shared/message';

import { UIMessage } from 'ai';
import { FlightWidgetComponent } from '../assistant-chat/widgets/flight-widget.component';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MessageComponent,
    FlightWidgetComponent,
  ],
  templateUrl: './chat-messages.html',
  styleUrls: ['./chat-messages.css'],
})
export class ChatMessages {
  messages = input.required<UIMessage[]>();
  pending = input<boolean>(false);
  showIndicator = computed(
    () => this.pending() 
  );

  icons = {
    user: '💬',
    assistant: '🤖',
    system: '🤖',
    error: '⚡️',
  };

  constructor() {
    effect(() => {
      console.log('messages', this.messages());
    });
  }

  // messageModels = computed(() =>
  //   this.messages().map((message) => ({
  //     ...message,
  //     // content: String(message.content),
  //     contentString: String(message.content),
  //     icon: this.icons[message.role] || '❓',
  //     toolCalls: message.role === 'assistant' ? message.toolCalls : [],
  //   }))
  // );
}
