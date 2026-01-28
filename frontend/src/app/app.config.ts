import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NgrokInterceptor } from './interceptors/ngrok.interceptor'; // Importe o novo interceptor
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
      // Adicionamos o interceptor funcional aqui
      withInterceptors([authErrorInterceptor]),
      // E permitimos o uso de interceptores de classe (DI)
      withInterceptorsFromDi()
    ),
    importProvidersFrom(
      FormsModule,
    ),
    // Registro do seu AuthInterceptor atual
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    // REGISTRO DO NOVO INTERCEPTOR DO NGROK
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NgrokInterceptor,
      multi: true
    }
  ],
};
