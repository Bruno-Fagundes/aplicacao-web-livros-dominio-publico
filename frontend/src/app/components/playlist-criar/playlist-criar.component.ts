// src/app/components/playlist-criar/playlist-criar.component.ts
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

    // obtém id do usuário logado
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

    // preview da imagem
    this.form.get('imagemUrl')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: string) => {
        this.imagemPreview = val ? val : null;
      });
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

    const payload: CriarPlaylistPayload = {
      usuarioId: this.usuarioIdLogado,
      titulo: this.form.value.titulo,
      descricao: this.form.value.descricao?.trim() || null,
      imagemUrl: this.form.value.imagemUrl?.trim() || 'assets/images/capa-playlist/capa-playlist.svg'
    };

    this.carregando = true;
    this.playlistService.criarPlaylist(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (created: Playlist) => {
          this.carregando = false;
          if (created && created.playlistId) {
            // navega para a playlist criada
            this.router.navigate(['/playlists', created.playlistId, 'usuarios', created.usuario?.usuarioId ?? this.usuarioIdLogado]);
          } else {
            // fallback para perfil do usuário
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

  // getters para template
  get titulo() { return this.form.get('titulo'); }
  get descricao() { return this.form.get('descricao'); }
  get imagemUrl() { return this.form.get('imagemUrl'); }
}
