// src/app/app.routes.ts

import { Routes } from '@angular/router';
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

export const routes: Routes = [
    { path: '', component: PaginaInicialComponent }, // <-- Mudei para o topo
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'usuarios/undefined', component: LoginComponent },
    { path: 'pagina-inicial', component: PaginaInicialComponent },
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
    { path: 'livros', component: LivrosComponent },
    { path: 'autores/:id', component: AutorDetalhesComponent },
    { path: 'autores', component: AutoresComponent },
    { path: 'usuarios/:id', component: UsuarioDetalhesComponent },
    { path: '**', component: PaginaInicialComponent },
];