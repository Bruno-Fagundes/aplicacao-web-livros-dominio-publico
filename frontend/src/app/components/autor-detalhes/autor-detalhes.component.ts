// src/app/pages/autor-detalhes/autor-detalhes.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AutorService } from '../../services/autor.service';
import { AutorDetalhes } from '../../interfaces/autor.interface';

@Component({
  selector: 'app-autor-detalhes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './autor-detalhes.component.html',
  styleUrls: ['./autor-detalhes.component.scss']
})
export class AutorDetalhesComponent implements OnInit {
  autor: AutorDetalhes | null = null;
  carregando = true;
  erro = false;

  constructor(
    private route: ActivatedRoute,
    private autorService: AutorService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    if (id) {
      this.carregarAutor(id);
    } else {
      this.carregando = false;
      this.erro = true;
    }
  }

  carregarAutor(id: number): void {
    this.carregando = true;
    this.erro = false;

    this.autorService.buscarDetalhesAutor(id).subscribe({
      next: (autor: AutorDetalhes | null) => {
        this.autor = autor;
        this.carregando = false;
      },
      error: () => {
        this.erro = true;
        this.carregando = false;
      }
    });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = 'assets/images/placeholder-autor.jpg'; // Altere para uma imagem de placeholder de autor
  }
}
