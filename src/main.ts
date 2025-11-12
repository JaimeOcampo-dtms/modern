import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { NextFlightsModule } from './app/next-flights/next-flights.module';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideHashbrown } from '@hashbrownai/angular';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideHttpClient(),
    provideRouter(
      APP_ROUTES,
      withPreloading(PreloadAllModules),
      withComponentInputBinding()
    ),
    importProvidersFrom(NextFlightsModule),
    importProvidersFrom(MatDialogModule),
    provideNativeDateAdapter(),

    provideHashbrown({
      baseUrl: 'http://localhost:3000/api/chat',
      middleware: [
        (req) => {
          console.log('[Hashbrown Request]', req);
          return req;
        }
      ]
    }),
  ],
});
