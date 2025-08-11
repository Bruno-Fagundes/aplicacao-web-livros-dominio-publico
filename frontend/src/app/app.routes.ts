import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial.component';
import { LivroDetalhesComponent } from './components/livro-detalhes/livro-detalhes.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    //    { path: '', redirectTo: '/login', pathMatch: 'full' },
    //    { path: '**', redirectTo: '/login' },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'pagina-inicial', component: PaginaInicialComponent },
    { path: 'livros/:id', component: LivroDetalhesComponent },
    { path: '**', component: PaginaInicialComponent },
    { path: '', component: PaginaInicialComponent },
];
