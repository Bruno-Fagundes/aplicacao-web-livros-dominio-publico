import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, forkJoin, Observable } from 'rxjs';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist, Livro } from '../../interfaces/playlist.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PlaylistAdicionarLivroComponent } from '../playlist-adicionar-livro/playlist-adicionar-livro.component';
import { ClassificacaoService } from '../../services/classificacao.service';
import { AuthService } from '../../services/auth.service';

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

  mostrarModalAdicionarLivro = false;

  private destroy$ = new Subject<void>();
  private playlistId: number | null = null;
  private usuarioId: number | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private playlistService = inject(PlaylistService);
  private classificacaoService = inject(ClassificacaoService);
  private authService = inject(AuthService);

  constructor() { }

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

    let playlistObservable: Observable<Playlist>;

    if (this.usuarioId != null && this.playlistId != null) {
      playlistObservable = this.playlistService.buscarPlaylistPorUsuarioEId(this.usuarioId, this.playlistId);
    } else if (this.playlistId != null) {
      playlistObservable = this.playlistService.buscarPlaylistPorId(this.playlistId);
    } else {
      this.onLoadError({ status: 400, message: 'Parâmetros de rota inválidos' });
      return;
    }

    playlistObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: p => this.onLoaded(p),
        error: err => this.onLoadError(err)
      });
  }

  private onLoaded(p: Playlist) {
    if (p?.usuario && (p.usuario as any).fotoPerfilUrl) {
      (p.usuario as any).fotoPerfilUrl = this.getFotoPerfilUrl((p.usuario as any).fotoPerfilUrl);
    }
    this.playlist = p;
    this.carregando = false;
    this.erro = false;

    this.carregarNotasDoUsuarioParaLivros();
  }

  private carregarNotasDoUsuarioParaLivros(): void {
    if (!this.playlist || !this.playlist.livros || this.playlist.livros.length === 0) {
      console.log('Sem livros na playlist para carregar notas');
      return;
    }

    // ⭐️ OBTÉM O ID DO USUÁRIO LOGADO
    const usuarioLogado = this.authService.getCurrentUser();
    const usuarioLogadoId = usuarioLogado?.id ?? (usuarioLogado as any)?.id;

    if (!usuarioLogadoId) {
      console.log('Usuário não está logado - pulando carregamento de notas');
      return;
    }

    console.log(`Carregando notas para ${this.playlist.livros.length} livros...`);
    console.log('Usuario logado:', usuarioLogado);
    console.log('Usuario logado ID:', usuarioLogadoId);

    const requests = this.playlist.livros.map(livro => {
      console.log(`Buscando nota para livroId=${livro.livroId}, usuarioId=${usuarioLogadoId}`);
      return this.classificacaoService.buscarNotaDoUsuario(livro.livroId, usuarioLogadoId);
    });

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (classificacoes) => {
          console.log('Notas recebidas:', classificacoes);

          classificacoes.forEach((classificacao, index) => {
            if (this.playlist && this.playlist.livros[index]) {
              this.playlist.livros[index].notaDoUsuario = classificacao?.nota ?? null;
              console.log(`Livro ${this.playlist.livros[index].titulo}: nota = ${this.playlist.livros[index].notaDoUsuario}`);
            }
          });
        },
        error: (err) => {
          console.error("Erro ao carregar notas do usuário:", err);
        }
      });
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
      this.http.delete(`http://localhost:8080/api/playlists/${this.playlist.playlistId}`).subscribe({
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
    this.mostrarModalAdicionarLivro = true;
  }

  fecharModalAdicionarLivro(): void {
    this.mostrarModalAdicionarLivro = false;
  }

  onLivroAdicionado(): void {
    this.fecharModalAdicionarLivro();
    this.carregarPlaylist();
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