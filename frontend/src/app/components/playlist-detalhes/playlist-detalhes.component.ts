import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist } from '../../interfaces/playlist.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PlaylistAdicionarLivroComponent } from '../playlist-adicionar-livro/playlist-adicionar-livro.component';

@Component({
  selector: 'app-playlist-detalhes',
  templateUrl: './playlist-detalhes.component.html',
  styleUrls: ['./playlist-detalhes.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, PlaylistAdicionarLivroComponent]
})
export class PlaylistDetalhesComponent implements OnInit, OnDestroy {
  playlist: Playlist | null = null;
  carregando = false;
  erro = false;
  erroMsg = '';

  // Propriedade para controlar o estado do modal
  mostrarModalAdicionarLivro = false;

  private destroy$ = new Subject<void>();
  private playlistId: number | null = null;
  private usuarioId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private playlistService: PlaylistService
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(paramMap => {
        const pId = paramMap.get('playlistId') ?? paramMap.get('id');
        const uId = paramMap.get('usuarioId') ?? paramMap.get('usuario');

        this.playlistId = pId ? Number(pId) : null;
        this.usuarioId = uId ? Number(uId) : null;

        this.carregarPlaylist();
      });
  }

  carregarPlaylist(): void {
    this.erro = false;
    this.erroMsg = '';
    this.carregando = true;
    this.playlist = null;

    if (this.usuarioId != null && this.playlistId != null) {
      this.playlistService.buscarPlaylistPorUsuarioEId(this.usuarioId, this.playlistId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: p => this.onLoaded(p),
          error: err => this.onLoadError(err)
        });
      return;
    }

    if (this.playlistId != null) {
      this.playlistService.buscarPlaylistPorId(this.playlistId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: p => this.onLoaded(p),
          error: err => this.onLoadError(err)
        });
      return;
    }

    this.onLoadError({ status: 400, message: 'Parâmetros de rota inválidos' });
  }

  private onLoaded(p: Playlist) {
    if (p?.usuario && (p.usuario as any).fotoPerfilUrl) {
      (p.usuario as any).fotoPerfilUrl = this.getFotoPerfilUrl((p.usuario as any).fotoPerfilUrl);
    }
    this.playlist = p;
    this.carregando = false;
    this.erro = false;
  }

  private onLoadError(err: any) {
    this.carregando = false;
    this.erro = true;
    if (err?.status === 404) {
      this.erroMsg = 'Playlist não encontrada.';
    } else if (err?.status === 0) {
      this.erroMsg = 'Erro de conexão com o servidor.';
    } else {
      this.erroMsg = err?.message || 'Erro ao carregar a playlist.';
    }
  }


  deletarPlaylist(): void {
    const confirmacao = confirm('Tem certeza que deseja deletar esta playlist?');
    if (confirmacao && this.playlist?.playlistId) {
      this.http.delete(`http://localhost:8080/playlists/${this.playlist.playlistId}`).subscribe({
        next: () => {
          alert('Playlist deletada com sucesso!');
          this.router.navigate(['/usuarios', this.playlist?.usuario?.usuarioId]);
        },
        error: (erro: HttpErrorResponse) => {
          alert(`Ocorreu um erro ao deletar a playlist. Verifique o console para mais detalhes.`);
        }
      });
    }
  }
  abrirModalAdicionarLivro(): void {
    console.log('Botão clicado - abrindo modal...'); // ⭐️ Adicione esta linha
    this.mostrarModalAdicionarLivro = true;
    console.log('mostrarModalAdicionarLivro:', this.mostrarModalAdicionarLivro); // ⭐️ E esta
  }

  // Método para fechar o modal
  fecharModalAdicionarLivro(): void {
    this.mostrarModalAdicionarLivro = false;
  }

  // Método para recarregar a playlist após adicionar um livro
  onLivroAdicionado(): void {
    this.fecharModalAdicionarLivro();
    this.carregarPlaylist();
  }

  testeClick(): void {
    console.log('🧪 TESTE: Angular está funcionando!');
    alert('Angular está funcionando! O problema não é o binding.');
  }

  getCapaUrl(): string {
    if (!this.playlist) return 'assets/images/capa-playlist/capa-playlist.svg';
    const fromLivro = this.playlist.livros && this.playlist.livros.length ? this.playlist.livros[0].urlCapa : null;
    return fromLivro || this.playlist.imagemUrl || 'assets/images/fallbacks/capa-playlist-fallback.png';
  }

  getFotoPerfilUrl(fotoPerfilUrl?: string | null): string {
    const fallback = 'assets/images/foto-perfil-usuario/foto-usuario.svg';
    if (!fotoPerfilUrl) return fallback;
    if (!fotoPerfilUrl.includes('.')) return fotoPerfilUrl.replace(/\/+$/, '') + '/foto-usuario.svg';
    if (!fotoPerfilUrl.startsWith('http') && !fotoPerfilUrl.startsWith('/')) return '/' + fotoPerfilUrl;
    return fotoPerfilUrl;
  }

  onImageErrorCover(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    img.onerror = null;
    img.src = 'assets/images/capa-playlist/capa-playlist.svg';
  }

  onImageErrorUsuario(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    img.onerror = null;
    img.src = 'assets/images/foto-perfil-usuario/foto-usuario.svg';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}