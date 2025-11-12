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
  template: `
    <article class="msg assistant">
      <div class="avatar">🤖</div>
      <div>
        <div class="bubble">Hi! How can I help you?</div>
        <div class="meta"></div>
      </div>
    </article>

    @for (message of messages(); track $index) { @switch (message.role) { @case
    ('user') {
    <article class="msg assistant">
      <div class="avatar">💬</div>
      <div>
        <div class="bubble">
          {{ message.content }}
        </div>
        <div class="meta"></div>
      </div>
    </article>
    } @case ('assistant') {
    <article class="msg assistant">
      <div class="avatar">🤖</div>
      <div>
        <div class="bubble">
          {{ message.content }}
          @for(toolCall of message.toolCalls; track toolCall.toolCallId) {
          <div [title]="toolCall.args | json">Tool Call: {{ toolCall.name }} ({{ toolCall.status }}) </div>
          }
        </div>
        <div class="meta"></div>
      </div>
    </article>
    } @case ('error') {
    <article class="msg assistant">
      <div class="avatar">⚡️</div>
      <div>
        <div class="bubble">Error: {{ message.content }}</div>
        <div class="meta"></div>
      </div>
    </article>
    } } }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        padding: 16px;
      }

      .chat-message.user {
        padding: 16px;
        max-width: 80%;
        background: #fff;
        align-self: flex-end;
        margin-top: 16px;

        > p {
          color: var(--gray-dark, #3d3c3a);
          font-family: Fredoka;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }

      .chat-message.assistant {
        display: grid;
        width: 100%;
        grid-template-columns: 24px 1fr;
        grid-template-rows: auto auto;
        grid-template-areas:
          'avatar content'
          'blank content';
        column-gap: 16px;
        padding: 16px 0px;
      }

      .chat-message.assistant ::ng-deep .app-markdown {
        p {
          color: var(--gray-dark, #3d3c3a);
          font-family: Fredoka;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }

      .chat-message.assistant.hasToolCalls {
        row-gap: 8px;
        grid-template-areas:
          'avatar tools'
          'blank content';
      }

      .assistant-avatar {
        grid-area: avatar;
        display: flex;
      }

      .assistant-avatar img {
        width: 24px;
        height: 24px;
        border-radius: 8px;
      }

      .assistant-tools {
        grid-area: tools;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px;
      }

      .assistant-content {
        grid-area: content;

        > hb-render-message {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        > hb-render-message > p {
          color: var(--gray-dark, #3d3c3a);
          font-family: Fredoka;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }

      .chat-message.component {
        align-self: flex-start;
        width: 100%;
      }

      .chat-message.tool {
        align-self: flex-start;
        width: 100%;
        font-style: italic;
      }

      .chat-message.error {
        padding: 16px;
        border-radius: 16px;
        width: 80%;
        background-color: var(--mat-sys-error-container);
        align-self: flex-start;
        margin-top: 16px;
        display: flex;
        align-items: center;
      }

      .chat-message.error span {
        width: 100%;
      }

      .chat-message.error mat-icon {
        width: 32px !important;
      }

      .chat-message.error button[mat-button] {
        align-self: flex-end;
        height: 16px;
      }
    `,
  ],
})
export class ChatMessages {
  messages = input.required<Chat.Message<string, AnyTool>[]>();
}
