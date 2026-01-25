// src/app/pages/autor-detalhes/autor-detalhes.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AutorService } from '../../services/autor.service';
import { AutorDetalhes } from '../../interfaces/autor.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { AuthService } from '../../services/auth.service';
import { takeUntil, Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-autor-detalhes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './autor-detalhes.component.html',
  styleUrls: ['./autor-detalhes.component.scss']
})
export class AutorDetalhesComponent implements OnInit, OnDestroy {
  autor: AutorDetalhes | null = null;
  carregando = true;
  erro = false;

  usuarioLogado: Usuario | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private autorService: AutorService,
    private authService: AuthService,
    private title: Title
  ) { }

  ngOnInit(): void {
    // Observa mudanças nos params (útil ao navegar entre autores sem recriar componente)
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(paramMap => {
        const idParam = paramMap.get('id');
        const id = idParam ? Number(idParam) : null;
        if (id) {
          this.carregarAutor(id);
        } else {
          this.carregando = false;
          this.erro = true;
          this.title.setTitle('Autor — Literatura Pública');
        }
      });

    // usuario
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(usuario => {
        this.usuarioLogado = usuario;
      });
  }

  carregarAutor(id: number): void {
    this.carregando = true;
    this.erro = false;

    this.autorService.buscarDetalhesAutor(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (autor: AutorDetalhes | null) => {
          this.autor = autor;
          this.carregando = false;

          if (this.autor && (this.autor.nome && this.autor.nome.trim().length > 0)) {
            this.title.setTitle(`${this.autor.nome}`);
          } else {
            this.title.setTitle('Autor — Literatura Pública');
          }
        },
        error: () => {
          this.erro = true;
          this.carregando = false;
          this.title.setTitle('Autor — Literatura Pública');
        }
      });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = 'assets/images/placeholder-autor.jpg';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
