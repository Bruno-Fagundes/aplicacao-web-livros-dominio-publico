import { RouterModule, Routes } from '@angular/router';

import { PaginaInicialComponent } from '../app/components/pagina-inicial/pagina-inicial.component';
import { LivroDetalhesComponent } from '../app/components/livro-detalhes/livro-detalhes.component';
import { UsuarioDetalhesComponent } from './components/usuario-detalhes/usuario-detalhes.component';
import { PlaylistDetalhesComponent } from './components/playlist-detalhes/playlist-detalhes.component';

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
    },
    {
        path: 'usuarios/:id',
        component: UsuarioDetalhesComponent,
        title: '{{ usuario.nome }} '
    },
    { path: 'playlists/:id', component: PlaylistDetalhesComponent },];

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
