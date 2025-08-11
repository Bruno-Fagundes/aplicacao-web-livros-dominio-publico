import { Component, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service';
import { LivroDetalhes } from '../../interfaces/livro.interface'; // Reusing your existing interface
import { AutorDetalhes } from '../../interfaces/livro.interface'; // Assuming a new interface or reusing the existing one
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagina-inicial',
  imports: [
    CommonModule, // Adicione aqui para *ngIf e *ngFor
    RouterLink, // Adicione aqui para [routerLink]
  ],
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss']
})
export class PaginaInicialComponent implements OnInit {
  livrosPopulares: LivroDetalhes[] = [];
  autoresPopulares: AutorDetalhes[] = []; // You'll need to create a service method for this
  livrosRecomendados: LivroDetalhes[] = []; // This will be used when a user is logged in
  carregando = true;
  erro = false;

  constructor(private livroService: LivroService) { }

  ngOnInit(): void {
    // For now, we'll use the 'listarTodosOsLivros' endpoint as a placeholder
    // for all three sections to populate the view.
    this.carregarLivrosPopulares();
    // this.carregarAutoresPopulares(); // Placeholder for future implementation
    // this.carregarLivrosRecomendados(); // Placeholder for future implementation
  }

  carregarLivrosPopulares(): void {
    this.carregando = true;
    this.livroService.listarTodosOsLivros().subscribe({
      next: (livros) => {
        this.livrosPopulares = livros;
        // As a placeholder, we'll use the same data for recommended books
        this.livrosRecomendados = livros;
        this.carregando = false;
        this.erro = false;
      },
      error: (err) => {
        console.error('Error fetching popular books', err);
        this.erro = true;
        this.carregando = false;
      }
    });
  }
}