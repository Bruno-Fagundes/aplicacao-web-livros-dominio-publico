// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// importe aqui os seus componentes de rota, ex:
import { PaginaInicialComponent } from '../app/components/pagina-inicial/pagina-inicial.component';
import { LivroDetalhesComponent } from '../app/components/livro-detalhes/livro-detalhes.component';

export const routes: Routes = [
    {
        path: '',
        component: PaginaInicialComponent,
        title: 'Página Inicial'
    },
    {
        path: 'livro/:id',
        component: LivroDetalhesComponent,
        title: 'Detalhes do Livro'
    }
];

// Onde você configura o roteamento principal (geralmente em main.ts)
// Adicione a configuração de rolagem:

// import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
// import { routes } from './app/app.routes';
//
// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes, withComponentInputBinding(), withRouterConfig({
//       scrollPositionRestoration: 'top'
//     }))
//   ]
// });
