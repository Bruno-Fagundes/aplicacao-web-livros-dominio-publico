import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist } from '../../interfaces/playlist.interface';

@Component({
  selector: 'app-playlist-editar',
  templateUrl: './playlist-editar.component.html',
  styleUrls: ['./playlist-editar.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class PlaylistEditarComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  carregando = false;
  erroMsg: string | null = null;
  playlistId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private playlistService: PlaylistService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      descricao: [''],
      imagemUrl: ['']
    });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(pm => {
      const p = pm.get('playlistId') ?? pm.get('id');
      this.playlistId = p ? Number(p) : null;
      if (this.playlistId) this.loadPlaylist(this.playlistId);
    });
  }

  private loadPlaylist(id: number) {
    this.carregando = true;
    this.playlistService.buscarPlaylistPorId(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: p => {
        this.form.patchValue({
          titulo: p.titulo,
          descricao: p.descricao,
          imagemUrl: p.imagemUrl
        });
        this.carregando = false;
      },
      error: err => {
        console.error(err);
        this.erroMsg = 'Erro ao carregar playlist.';
        this.carregando = false;
      }
    });
  }

  salvar() {
    if (!this.playlistId) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const payload = {
      titulo: this.form.value.titulo,
      descricao: this.form.value.descricao?.trim() || null,
      imagemUrl: this.form.value.imagemUrl?.trim() || null
    };

    this.playlistService.atualizarPlaylist(this.playlistId, payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: updated => {
        this.router.navigate(['/playlists', updated.playlistId, 'usuarios', updated.usuario?.usuarioId]);
      },
      error: err => {
        console.error(err);
        this.erroMsg = 'Erro ao atualizar playlist.';
      }
    });
  }

  cancelar() { this.router.navigate(['/playlists', this.playlistId, 'usuarios', /* caso tenha */]); }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
