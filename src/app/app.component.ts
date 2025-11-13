import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { NextFlightsModule } from './next-flights/next-flights.module';
import { ConfigService } from './shared/config.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AssistantChatComponent } from './ai-assistant/assistant-chat/assistant-chat.component';

@Component({
  imports: [
    SidebarComponent,
    NavbarComponent,
    NextFlightsModule,
    RouterOutlet,
    AssistantChatComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  configService = inject(ConfigService);

  constructor() {
    this.configService.loadConfig();
  }
}
