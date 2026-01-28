import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LivroDetalhes } from '../../interfaces/livro.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { Subject, takeUntil } from 'rxjs';
import { LivroService } from '../../services/livro.service';
import { AuthService } from '../../services/auth.service';
import { LivroFiltrosComponent } from "../livro-filtros/livro-filtros.component";

@Component({
  selector: 'app-livros',
  imports: [CommonModule, RouterModule, LivroFiltrosComponent],
  templateUrl: './livros.component.html',
  styleUrl: './livros.component.scss'
})
export class LivrosComponent implements OnInit, OnDestroy {
  carregando: boolean = true;
  erro: boolean = false;
  livros: LivroDetalhes[] = [];
  page: number = 0;
  size: number = 12;
  lastPage: boolean = false;
  usuarioLogado: Usuario | null = null;
  ordenacaoAtual: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private livroService: LivroService  // ← ADICIONE ISSO
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(usuario => {
        this.usuarioLogado = usuario;
      });
    
    // ========== ADICIONE ISSO ==========
    this.carregarLivrosIniciais();
  }

  carregarLivrosIniciais(): void {
    this.carregando = true;
    this.livroService.listarLivrosPaginados(this.page, this.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Dados recebidos:', response); // ← Para debug
          this.livros = response.content;
          this.lastPage = response.last;
          this.carregando = false;
          this.erro = false;
        },
        error: (error) => {
          console.error('Erro ao carregar livros:', error);
          this.carregando = false;
          this.erro = true;
        }
      });
  }
  // =====================================

  onLivrosFiltrados(response: any) {
    if (this.page === 0) {
      this.livros = response.content;
    } else {
      this.livros = [...this.livros, ...response.content];
    }
    this.lastPage = response.last;
    this.carregando = false;
    this.erro = false;
  }

  onOrdenacaoAlterada(ordenacao: string | null) {
    this.ordenacaoAtual = ordenacao;
  }

  carregarMaisLivros(): void {
    if (!this.lastPage && !this.carregando) {
      this.carregando = true;
      this.page++;
      
      this.livroService.listarLivrosPaginados(this.page, this.size)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.livros = [...this.livros, ...response.content];
            this.lastPage = response.last;
            this.carregando = false;
          },
          error: (error) => {
            console.error('Erro ao carregar mais livros:', error);
            this.carregando = false;
            this.erro = true;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
