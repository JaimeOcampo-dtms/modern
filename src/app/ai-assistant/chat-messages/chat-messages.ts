import { JsonPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Chat } from '@hashbrownai/core';
import { MarkdownComponent } from 'ngx-markdown';

import { AnyTool } from 'node_modules/@hashbrownai/core/src/models/view.models';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    JsonPipe,
    MatTooltipModule,
    MarkdownComponent
  ],
  templateUrl: './chat-messages.html',
  styleUrls: ['./chat-messages.css'],
})
export class ChatMessages {
  messages = input.required<Chat.Message<string, AnyTool>[]>();
  pending = input<boolean>(false);
  showIndicator = computed(() => this.pending() && this.messages().at(-1)?.role !== 'assistant');
}
