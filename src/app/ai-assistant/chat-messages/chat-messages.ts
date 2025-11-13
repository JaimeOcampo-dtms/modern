import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Chat } from '@hashbrownai/core';
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
  ],
  templateUrl: './chat-messages.html',
  styleUrls: ['./chat-messages.css'],
})
export class ChatMessages {
  messages = input.required<Chat.Message<string, AnyTool>[]>();
}
