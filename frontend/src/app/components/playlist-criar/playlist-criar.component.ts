import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist } from '../../interfaces/playlist.interface';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

interface CriarPlaylistPayload {
  usuarioId: number;
  titulo: string;
  descricao?: string | null;
  imagemUrl?: string | null;
}

@Component({
  selector: 'app-playlist-criar',
  templateUrl: './playlist-criar.component.html',
  styleUrls: ['./playlist-criar.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class PlaylistCriarComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  carregando = false;
  erroMsg: string | null = null;
  imagemPreview: string | null = null;
  private destroy$ = new Subject<void>();
  usuarioIdLogado: number | null = null;

  private readonly IMAGEM_PADRAO = 'assets/images/capa-playlist/capa-playlist.svg';

  constructor(
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      descricao: [''],
      imagemUrl: ['']
    });

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(u => {
        if (!u) {
          this.usuarioIdLogado = null;
          return;
        }
        const id = (u as any)?.usuarioId ?? (u as any)?.id ?? (u as any)?.userId;
        this.usuarioIdLogado = id ?? null;
      });

    this.form.get('imagemUrl')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: string) => {
        const url = val?.trim();
        this.imagemPreview = url ? url : this.IMAGEM_PADRAO;
      });

    this.imagemPreview = this.IMAGEM_PADRAO;
  }

  submit(): void {
    this.erroMsg = null;

    if (!this.usuarioIdLogado) {
      this.erroMsg = 'Você precisa estar logado para criar uma playlist.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const imagemUrlValue = this.form.value.imagemUrl?.trim();

    const payload: CriarPlaylistPayload = {
      usuarioId: this.usuarioIdLogado,
      titulo: this.form.value.titulo.trim(),
      descricao: this.form.value.descricao?.trim() || null,
      imagemUrl: imagemUrlValue || null
    };

    console.log('Payload enviado para criar playlist:', payload);

    this.carregando = true;
    this.playlistService.criarPlaylist(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (created: Playlist) => {
          this.carregando = false;
          console.log('Playlist criada:', created);
          console.log('Imagem da playlist criada:', created.imagemUrl);
          if (created && created.playlistId) {
            this.router.navigate(['/playlists', created.playlistId, 'usuarios', created.usuario?.usuarioId ?? this.usuarioIdLogado]);
          } else {
            this.router.navigate(['/usuarios', this.usuarioIdLogado]);
          }
        },
        error: (err) => {
          this.carregando = false;
          console.error('Erro ao criar playlist', err);
          if (err?.status === 400) {
            this.erroMsg = 'Dados inválidos. Verifique o formulário.';
          } else if (err?.status === 401 || err?.status === 403) {
            this.erroMsg = 'Você não tem permissão para executar esta ação.';
          } else {
            this.erroMsg = 'Erro ao criar playlist. Tente novamente mais tarde.';
          }
        }
      });
  }

  cancelar(): void {
    window.history.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get titulo() { return this.form.get('titulo'); }
  get descricao() { return this.form.get('descricao'); }
  get imagemUrl() { return this.form.get('imagemUrl'); }
}