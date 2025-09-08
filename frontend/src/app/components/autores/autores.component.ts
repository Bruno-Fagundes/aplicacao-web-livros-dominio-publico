import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutorService } from '../../services/autor.service';
import { AutorDetalhes } from '../../interfaces/autor.interface';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from '../../interfaces/usuario.interface';
import { AuthService } from '../../services/auth.service';
import { AutorFiltrosComponent } from '../autor-filtros/autor-filtros.component';

@Component({
  selector: 'app-autores',
  standalone: true,
  imports: [CommonModule, RouterModule, AutorFiltrosComponent],
  templateUrl: './autores.component.html',
  styleUrls: ['./autores.component.scss']
})
export class AutoresComponent implements OnInit, OnDestroy {
  onImageError($event: ErrorEvent) {
    throw new Error('Method not implemented.');
  }
  carregando = true;
  erro = false;

  autores: AutorDetalhes[] = [];
  autoresExibidos: AutorDetalhes[] = [];

  usuarioLogado: Usuario | null = null;
  private destroy$ = new Subject<void>();

  // Variável para rastrear o critério de ordenação atual
  criterioOrdenacaoAtual: string | null = null;

  constructor(
    private autorService: AutorService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(usuario => {
        this.usuarioLogado = usuario;
      });

    this.carregarAutores();
  }

  carregarAutores(): void {
    this.autorService.listarAutores().subscribe({
      next: (autores) => {
        this.autores = autores;
        this.autoresExibidos = [...this.autores];
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar autores:', err);
        this.erro = true;
        this.carregando = false;
      }
    });
  }

  onOrdenar(criterio: string | null): void {
    this.criterioOrdenacaoAtual = criterio;
    this.autoresExibidos = [...this.autores];

    switch (criterio) {
      case 'nomeAsc':
        this.autoresExibidos.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'nomeDesc':
        this.autoresExibidos.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case 'livrosDesc':
        this.autoresExibidos.sort((a, b) => b.livros.length - a.livros.length);
        break;
      case 'livrosAsc':
        this.autoresExibidos.sort((a, b) => a.livros.length - b.livros.length);
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}