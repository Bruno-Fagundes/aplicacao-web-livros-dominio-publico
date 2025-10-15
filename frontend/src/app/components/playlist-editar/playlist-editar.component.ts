import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist } from '../../interfaces/playlist.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-playlist-editar',
  templateUrl: './playlist-editar.component.html',
  styleUrls: ['./playlist-editar.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PlaylistEditarComponent implements OnInit, OnDestroy {
  @Input() playlistId!: number;
  @Output() fecharModal = new EventEmitter<void>();
  @Output() playlistAtualizada = new EventEmitter<void>();

  form!: FormGroup;
  playlist: Playlist | null = null;
  carregando = false;
  erroMsg: string | null = null;
  imagemPreview: string | null = null;

  private destroy$ = new Subject<void>();
  private readonly IMAGEM_PADRAO = 'assets/images/capa-playlist/capa-playlist.svg';

  constructor(
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      descricao: [''],
      imagemUrl: ['']
    });

    // Observa mudanças no campo de imagem para preview
    this.form.get('imagemUrl')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: string) => {
        this.imagemPreview = val ? val : null;
      });

    if (this.playlistId) {
      this.loadPlaylist(this.playlistId);
    }
  }

  private loadPlaylist(id: number): void {
    this.carregando = true;
    this.erroMsg = null;

    this.playlistService.buscarPlaylistPorId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (p) => {
          this.playlist = p;
          this.form.patchValue({
            titulo: p.titulo,
            descricao: p.descricao,
            imagemUrl: p.imagemUrl
          });
          this.imagemPreview = p.imagemUrl || this.IMAGEM_PADRAO;
          this.carregando = false;
        },
        error: (err) => {
          console.error('Erro ao carregar playlist:', err);
          this.erroMsg = 'Erro ao carregar playlist.';
          this.carregando = false;
        }
      });
  }

  /**
   * Determina qual imagem usar para a playlist baseado na lógica:
   * 1. Se usuário forneceu URL (não vazia e não padrão) -> usa ela
   * 2. Se playlist tem livros -> usa capa do último livro
   * 3. Caso contrário -> usa imagem padrão
   */
  private determinarImagemPlaylist(): string {
    const imagemUrlForm = this.form.value.imagemUrl?.trim();

    // Se o usuário forneceu uma URL não vazia e diferente da padrão, usa ela
    if (imagemUrlForm && imagemUrlForm !== this.IMAGEM_PADRAO) {
      return imagemUrlForm;
    }

    // Se a playlist tem livros, usa a capa do último livro
    if (this.playlist?.livros && this.playlist.livros.length > 0) {
      const ultimoLivro = this.playlist.livros[this.playlist.livros.length - 1];
      return ultimoLivro.urlCapa || this.IMAGEM_PADRAO;
    }

    // Se não tem livros, usa a imagem padrão
    return this.IMAGEM_PADRAO;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Determina qual imagem usar baseado na lógica definida
    const imagemFinal = this.determinarImagemPlaylist();

    const payload = {
      titulo: this.form.value.titulo.trim(),
      descricao: this.form.value.descricao?.trim() || null,
      imagemUrl: imagemFinal
    };

    this.carregando = true;
    this.erroMsg = null;

    this.playlistService.atualizarPlaylist(this.playlistId, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.carregando = false;
          this.playlistAtualizada.emit();
          this.fechar();
        },
        error: (err) => {
          console.error('Erro ao atualizar playlist:', err);
          this.erroMsg = 'Erro ao atualizar playlist.';
          this.carregando = false;
        }
      });
  }

  removerLivro(livroId: number): void {
    if (!confirm('Tem certeza que deseja remover este livro da playlist?')) {
      return;
    }

    this.carregando = true;
    this.erroMsg = null;

    this.http.delete(`http://localhost:8080/api/playlists/${this.playlistId}/livros/${livroId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Recarrega a playlist para atualizar a lista de livros
          this.loadPlaylist(this.playlistId);

          // Atualiza a imagem da playlist após remover o livro
          // (será recalculada automaticamente no próximo salvar ou pode fazer aqui)
          const imagemAtualizada = this.determinarImagemPlaylist();
          const payload = {
            titulo: this.form.value.titulo.trim(),
            descricao: this.form.value.descricao?.trim() || null,
            imagemUrl: imagemAtualizada
          };

          this.playlistService.atualizarPlaylist(this.playlistId, payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.carregando = false;
                // Notifica o componente pai para atualizar a visualização
                this.playlistAtualizada.emit();
              },
              error: (err) => {
                console.error('Erro ao atualizar imagem da playlist:', err);
                this.carregando = false;
              }
            });
        },
        error: (err) => {
          console.error('Erro ao remover livro:', err);
          this.erroMsg = 'Erro ao remover livro da playlist.';
          this.carregando = false;
        }
      });
  }

  fechar(): void {
    this.fecharModal.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get titulo() { return this.form.get('titulo'); }
  get descricao() { return this.form.get('descricao'); }
  get imagemUrl() { return this.form.get('imagemUrl'); }
}