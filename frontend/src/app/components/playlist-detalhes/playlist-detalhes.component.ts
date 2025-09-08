import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, of } from 'rxjs';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist } from '../../interfaces/playlist.interface';

@Component({
  selector: 'app-playlist-detalhes',
  templateUrl: './playlist-detalhes.component.html',
  styleUrls: ['./playlist-detalhes.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class PlaylistDetalhesComponent implements OnInit, OnDestroy {
  playlist: Playlist | null = null;
  carregando = false;
  erro = false;
  erroMsg = '';

  private destroy$ = new Subject<void>();
  private playlistId: number | null = null;
  private usuarioId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistService: PlaylistService
  ) { }

  ngOnInit(): void {
    // lê os params com os nomes corretos
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(paramMap => {
        const pId = paramMap.get('playlistId') ?? paramMap.get('id'); // fallback para id
        const uId = paramMap.get('usuarioId') ?? paramMap.get('usuario');

        this.playlistId = pId ? Number(pId) : null;
        this.usuarioId = uId ? Number(uId) : null;

        console.log('[PlaylistDetalhes] rota params:', { playlistId: this.playlistId, usuarioId: this.usuarioId });

        this.carregarPlaylist();
      });
  }

  carregarPlaylist(): void {
    this.erro = false;
    this.erroMsg = '';
    this.carregando = true;
    this.playlist = null;

    // Prioridade: carregar via endpoint usuario/{usuarioId}/playlist/{playlistId} (caso ambos existam)
    if (this.usuarioId != null && this.playlistId != null) {
      console.log('[PlaylistDetalhes] carregando via buscarPlaylistPorUsuarioEId');
      this.playlistService.buscarPlaylistPorUsuarioEId(this.usuarioId, this.playlistId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: p => this.onLoaded(p),
          error: err => this.onLoadError(err)
        });
      return;
    }

    // Se não houver usuarioId, tenta carregar apenas pela playlistId
    if (this.playlistId != null) {
      console.log('[PlaylistDetalhes] carregando via buscarPlaylistPorId');
      this.playlistService.buscarPlaylistPorId(this.playlistId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: p => this.onLoaded(p),
          error: err => this.onLoadError(err)
        });
      return;
    }

    // sem parâmetros
    this.onLoadError({ status: 400, message: 'Parâmetros de rota inválidos' });
  }

  private onLoaded(p: Playlist) {
    console.log('[PlaylistDetalhes] API retornou:', p);
    // normaliza: se backend retornar fotoPerfilUrl como pasta, corrige no usuário
    if (p?.usuario && (p.usuario as any).fotoPerfilUrl) {
      (p.usuario as any).fotoPerfilUrl = this.getFotoPerfilUrl((p.usuario as any).fotoPerfilUrl);
    }
    this.playlist = p;
    this.carregando = false;
    this.erro = false;
  }

  private onLoadError(err: any) {
    console.error('[PlaylistDetalhes] erro ao carregar playlist:', err);
    this.carregando = false;
    this.erro = true;
    // mensagem legível
    if (err?.status === 404) {
      this.erroMsg = 'Playlist não encontrada.';
    } else if (err?.status === 0) {
      this.erroMsg = 'Erro de conexão com o servidor.';
    } else {
      this.erroMsg = err?.message || 'Erro ao carregar a playlist.';
    }
  }

  // Usa primeiro livro como capa se existir, caso contrário usa imagem da playlist
  getCapaUrl(): string {
    if (!this.playlist) return 'assets/images/fallbacks/capa-playlist-fallback.png';
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

  // handlers de fallback para imagens
  onImageErrorCover(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    img.onerror = null;
    img.src = 'assets/images/fallbacks/capa-playlist-fallback.png';
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
