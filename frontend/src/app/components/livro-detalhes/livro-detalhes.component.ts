import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LivroService } from '../../services/livro.service';
import { LivroDetalhes } from '../../interfaces/livro.interface';

@Component({
  selector: 'app-livro-detalhes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './livro-detalhes.component.html',
  styleUrls: ['./livro-detalhes.component.scss']
})
export class LivroDetalhesComponent implements OnInit {
  livro: LivroDetalhes | null = null;
  carregando = true;
  erro = false;
  favorito = false;

  constructor(
    private route: ActivatedRoute,
    private livroService: LivroService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    if (id) {
      this.carregarLivro(id);
    } else {
      this.carregando = false;
      this.erro = true;
    }
  }

  carregarLivro(id: number): void {
    this.carregando = true;
    this.erro = false;

    this.livroService.buscarLivroPorId(id).subscribe({
      next: (livro) => {
        this.livro = livro;
        this.carregando = false;
      },
      error: () => {
        this.erro = true;
        this.carregando = false;
      }
    });
  }

  continuarLendo(): void {
    if (this.livro) {
      window.open(this.livro.urlPdf, '_blank');
    }
  }

  lerDoInicio(): void {
    if (this.livro) {
      window.open(this.livro.urlPdf, '_blank');
    }
  }

  toggleFavorito(): void {
    this.favorito = !this.favorito;
  }

  adicionarAosFavoritos(): void {
    this.favorito = true;
  }

  gerarEstrelas(nota: number = 0): number[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(nota) ? 1 : 0);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = 'assets/images/placeholder-cover.jpg';
  }
}
