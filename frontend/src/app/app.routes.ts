import { Routes } from '@angular/router';
import { PlaylistDetalhesComponent } from './components/playlist-detalhes/playlist-detalhes.component';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial.component';
import { LivroDetalhesComponent } from './components/livro-detalhes/livro-detalhes.component';
import { AutorDetalhesComponent } from './components/autor-detalhes/autor-detalhes.component';
import { AutoresComponent } from './components/autores/autores.component';
import { LivrosComponent } from './components/livros/livros.component';
import { UsuarioDetalhesComponent } from './components/usuario-detalhes/usuario-detalhes.component';
import { LivroService } from './services/livro.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { ResultadosPesquisaComponent } from './components/resultados-pesquisa/resultados-pesquisa.component';
import { PlaylistCriarComponent } from './components/playlist-criar/playlist-criar.component';
import { LivroLeituraComponent } from './components/livro-leitura/livro-leitura.component';

export const routes: Routes = [
    { path: '', component: PaginaInicialComponent, title: 'Literatura Pública' }, // <-- Mudei para o topo
    { path: 'login', component: LoginComponent, title: 'Login' },
    { path: 'cadastro', component: CadastroComponent, title: 'Cadastro' },
    { path: 'usuarios/undefined', component: LoginComponent, title: 'Login' },
    { path: 'pesquisa', component: ResultadosPesquisaComponent },
    { path: 'pagina-inicial', component: PaginaInicialComponent, title: 'Literatura Pública' },
    {
        path: 'livros/:id',
        component: LivroDetalhesComponent,
        resolve: {
            livro: (route: ActivatedRouteSnapshot) => {
                const livroService = inject(LivroService);
                const router = inject(Router);
                const id = Number(route.paramMap.get('id'));

                return livroService.buscarLivroPorId(id).pipe(
                    catchError(() => {
                        router.navigate(['/404']);
                        return EMPTY;
                    })
                );
            }
        },
    },
    {
        path: 'livros/leitura/:id',
        loadComponent: () =>
            import('./components/livro-leitura/livro-leitura.component').then(m => m.LivroLeituraComponent),
        title: 'Leitura'
    },
    { path: 'livros', component: LivrosComponent, title: 'Livros' },
    { path: 'autores/:id', component: AutorDetalhesComponent },
    { path: 'autores', component: AutoresComponent, title: 'Autores' },
    { path: 'usuarios/:id', component: UsuarioDetalhesComponent },
    { path: 'playlists/criar', component: PlaylistCriarComponent, title: 'Criar Playlist' },
    { path: 'playlists/:playlistId/usuarios/:usuarioId', component: PlaylistDetalhesComponent, title: 'Playlist' },
    { path: '**', component: PaginaInicialComponent, title: 'Literatura Pública' }
];