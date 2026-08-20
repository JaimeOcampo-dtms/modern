import { JsonPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MarkdownComponent } from 'ngx-markdown';

import { AnyTool } from '@hashbrownai/core/src/models/view.models';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolStatusComponent } from '../assistant-chat/tool-status/tool-status';
import { RenderMessageComponent, UiChatMessage } from '@hashbrownai/angular';
import { MessageComponent } from 'src/app/shared/message';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    JsonPipe,
    MatTooltipModule,
    RenderMessageComponent,
    // MarkdownComponent,
    MessageComponent,
    ToolStatusComponent,
  ],
  templateUrl: './chat-messages.html',
  styleUrls: ['./chat-messages.css'],
})
export class ChatMessages {
  messages = input.required<UiChatMessage<AnyTool>[]>();
  pending = input<boolean>(false);
  showIndicator = computed(
    () => this.pending() && this.messages().at(-1)?.role !== 'assistant'
  );

  icons = {
    user: '💬',
    assistant: '🤖',
    error: '⚡️',
  };

  messageModels = computed(() =>
    this.messages().map((message) => ({
      ...message,
      // content: String(message.content),
      contentString: String(message.content),
      icon: this.icons[message.role] || '❓',
      toolCalls: message.role === 'assistant' ? message.toolCalls : [],
    }))
  );
}
