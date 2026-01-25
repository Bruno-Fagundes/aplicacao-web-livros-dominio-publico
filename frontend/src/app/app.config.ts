import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { authErrorInterceptor } from './interceptors/auth-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      })
    ),
    provideHttpClient(
      withInterceptors([authErrorInterceptor])
    ),
    importProvidersFrom(
      HttpClientModule,
      FormsModule,
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
};