// src/app/components/livro-detalhes/livro-detalhes.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LivroDetalhes } from '../../interfaces/livro.interface';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from '../../interfaces/usuario.interface';
import { AutorService } from '../../services/autor.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-livro-detalhes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './livro-detalhes.component.html',
  styleUrls: ['./livro-detalhes.component.scss']
})
export class LivroDetalhesComponent implements OnInit, OnDestroy {
  public livro: LivroDetalhes | null = null;
  public carregando = true; // Inicie como 'true' para mostrar o spinner
  public erro = false;
  public favorito = false; // Lógica de favorito a ser implementada

  public usuarioLogado: Usuario | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private autorService: AutorService,
    private title: Title
  ) { }

  ngOnInit(): void {
    // Busca o livro que foi resolvido pela rota
    this.route.data
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ livro }) => {
          this.livro = livro;
          this.carregando = false;
          if (this.livro) {
            this.title.setTitle(this.livro.titulo + ' — Literatura Pública');
          } else {
            // Se o resolver retornou nulo, indica um erro
            this.erro = true;
          }
        },
        error: () => {
          this.carregando = false;
          this.erro = true;
        }
      });

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuario: Usuario | null) => {
        this.usuarioLogado = usuario;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public continuarLendo(): void {
    if (this.livro) {
      window.open(this.livro.urlPdf, '_blank');
    }
  }

  public lerDoInicio(): void {
    if (this.livro) {
      window.open(this.livro.urlPdf, '_blank');
    }
  }

  public onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = 'assets/images/placeholder-cover.jpg';
  }
}