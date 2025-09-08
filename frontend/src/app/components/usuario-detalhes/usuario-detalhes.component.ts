import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { PlaylistService, PageResponse } from '../../services/playlist.service';
import { Playlist } from '../../interfaces/playlist.interface';

@Component({
  selector: 'app-usuario-detalhes',
  imports: [CommonModule, RouterModule],
  templateUrl: './usuario-detalhes.component.html',
  styleUrls: ['./usuario-detalhes.component.scss']
})
export class UsuarioDetalhesComponent implements OnInit, OnDestroy {
  usuario: Usuario | null = null;
  carregando = true;
  erro = false;
  usuarioLogado: Usuario | null = null;
  playlists: Playlist[] = [];
  playlistsLoaded = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private title: Title,
    private playlistService: PlaylistService
  ) { }

  ngOnInit(): void {
    // usuário logado
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(u => {
        this.usuarioLogado = u;
      });

    // pega o id da rota
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(paramMap => {
        const idParam = paramMap.get('id');
        const id = idParam ? Number(idParam) : null;
        if (!id) {
          this.carregando = false;
          this.erro = true;
          this.title.setTitle(this.usuario?.nomeUsuario ?? this.usuarioLogado?.nomeUsuario ?? 'Usuário — Literatura Pública');
          return;
        }

        this.carregarUsuario(id);
        this.carregarPlaylistsDoUsuario(id);
      });
  }

  private carregarUsuario(id: number): void {
    this.carregando = true;
    this.usuarioService.buscarUsuarioPorId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (usuario) => {
          // força normalização da foto para não sumir
          usuario.fotoPerfilUrl = this.getFotoPerfilUrl(usuario.fotoPerfilUrl);

          this.usuario = usuario;
          this.carregando = false;
          this.erro = false;
          this.title.setTitle(this.usuario?.nomeUsuario ?? 'Usuário — Literatura Pública');
        },
        error: (err) => {
          console.error('Erro ao carregar usuário:', err);
          this.erro = true;
          this.carregando = false;
          this.title.setTitle('Usuário — Literatura Pública');
        }
      });
  }

  private carregarPlaylistsDoUsuario(usuarioId: number): void {
    this.playlistsLoaded = false;
    this.playlistService.listarPlaylistsPorUsuario(usuarioId, 0, 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pageResp: PageResponse<Playlist>) => {
          this.playlists = pageResp?.content ?? [];
          this.playlistsLoaded = true;
          console.log('[UsuarioDetalhes] Playlists carregadas:', this.playlists);
        },
        error: (err) => {
          console.error('[UsuarioDetalhes] Erro ao carregar playlists do usuário:', err);
          this.playlists = [];
          this.playlistsLoaded = true;
        }
      });
  }

  getFotoPerfilUrl(fotoPerfilUrl?: string | null): string {
    const fallback = 'assets/images/foto-perfil-usuario/foto-usuario.svg';
    if (!fotoPerfilUrl) return fallback;

    // se vier como pasta sem extensão, adiciona o arquivo padrão
    if (!fotoPerfilUrl.includes('.')) {
      return fotoPerfilUrl.replace(/\/+$/, '') + '/foto-usuario.svg';
    }

    // corrige caminho relativo
    if (!fotoPerfilUrl.startsWith('http') && !fotoPerfilUrl.startsWith('/')) {
      return '/' + fotoPerfilUrl;
    }

    return fotoPerfilUrl;
  }

  onImageErrorUsuario(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    img.onerror = null;
    img.src = 'assets/images/foto-perfil-usuario/foto-usuario.svg';
  }

  onImageErrorPlaylist(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    img.onerror = null;
    img.src = 'assets/images/placeholder-playlist.jpg';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
