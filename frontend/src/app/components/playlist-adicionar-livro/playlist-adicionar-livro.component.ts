import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { LivroDetalhes } from '../../interfaces/livro.interface';
import { PesquisaService } from '../../services/pesquisa.service';
import { PlaylistService } from '../../services/playlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlist-adicionar-livro',
  templateUrl: './playlist-adicionar-livro.component.html',
  styleUrls: ['./playlist-adicionar-livro.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PlaylistAdicionarLivroComponent implements OnInit, OnDestroy {
  @Input() playlistId!: number;
  @Output() livroAdicionado = new EventEmitter<void>();
  @Output() fecharModal = new EventEmitter<void>();

  termoBusca: string = '';
  sugestoesLivros: LivroDetalhes[] = [];
  carregandoBusca = false;

  private termoBusca$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private pesquisaService: PesquisaService,
    private playlistService: PlaylistService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // ⭐️ Configurar o observable no ngOnInit
    this.termoBusca$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(termo => {
      this.buscarLivros(termo);
    });
  }

  // ⭐️ NOVO: Método chamado pelo template quando o usuário digita
  onTermoChange(): void {
    console.log('🔍 Termo alterado:', this.termoBusca);
    this.termoBusca$.next(this.termoBusca);
  }

  // ⭐️ Método alternativo usando setTimeout (caso o Subject dê problema)
  onTermoChangeAlternativo(): void {
    console.log('🔍 Busca alternativa para:', this.termoBusca);
    setTimeout(() => {
      this.buscarLivros(this.termoBusca);
    }, 300);
  }

  // ⭐️ NOVO: Método para fechar o modal (chamado pelo template)
  fechar(): void {
    console.log('🔒 Fechando modal');
    this.fecharModal.emit();
  }

  // Seu método original, mas com logs para debug
  onTyping(): void {
    this.termoBusca$.next(this.termoBusca);
  }

  buscarLivros(termo: string): void {
    console.log('🔍 Buscando livros para termo:', termo);

    if (termo.length <= 0) {
      this.sugestoesLivros = [];
      this.carregandoBusca = false;
      return;
    }

    this.carregandoBusca = true;

    this.pesquisaService.buscarLivrosPorTitulo(termo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (livros: LivroDetalhes[]) => {
          console.log('✅ Livros encontrados:', livros.length, livros);
          this.sugestoesLivros = livros;
          this.carregandoBusca = false;
        },
        error: (err: any) => {
          console.error('❌ Erro ao buscar livros:', err);
          this.sugestoesLivros = [];
          this.carregandoBusca = false;
        }
      });
  }

  adicionarLivro(livroId: number): void {
    console.log('📚 Adicionando livro ID:', livroId, 'na playlist:', this.playlistId);

    this.playlistService.adicionarLivroNaPlaylist(this.playlistId, livroId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ Livro adicionado com sucesso!');
          alert('Livro adicionado com sucesso!');
          this.livroAdicionado.emit();
        },
        error: (err: any) => {
          console.error('❌ Erro ao adicionar livro:', err);
          alert('Ocorreu um erro ao adicionar o livro.');
        }
      });
  }

  trackByLivroId(index: number, livro: LivroDetalhes): number {
    return livro.livroId;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}