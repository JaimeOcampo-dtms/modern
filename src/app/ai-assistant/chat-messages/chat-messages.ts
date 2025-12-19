import { JsonPipe } from '@angular/common';
import { Component, computed, effect, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MarkdownComponent } from 'ngx-markdown';

import { AnyTool } from 'node_modules/@hashbrownai/core/src/models/view.models';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolStatusComponent } from '../assistant-chat/tool-status/tool-status';
import { MessageComponent } from 'src/app/shared/message';

import { UIMessage } from 'ai';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    JsonPipe,
    MatTooltipModule,
    // MarkdownComponent,
    MessageComponent,
    ToolStatusComponent,
  ],
  templateUrl: './chat-messages.html',
  styleUrls: ['./chat-messages.css'],
})
export class ChatMessages {
  messages = input.required<UIMessage[]>();
  pending = input<boolean>(false);
  showIndicator = computed(
    () => this.pending() && this.messages().at(-1)?.role !== 'assistant'
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
