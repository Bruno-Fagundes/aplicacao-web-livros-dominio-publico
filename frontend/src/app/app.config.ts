// src/app/app.config.ts
import { importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { routes } from "./app.routes";

export const appConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      RouterModule.forRoot(routes),
      HttpClientModule,
      FormsModule,
    ),
  ],
};
