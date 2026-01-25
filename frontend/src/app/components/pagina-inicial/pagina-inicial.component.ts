import { Component, OnDestroy, OnInit } from "@angular/core";
import { LivroService } from "../../services/livro.service";
import { LivroDetalhes } from "../../interfaces/livro.interface";
import { AutorService } from "../../services/autor.service";
import { AutorDetalhes } from "../../interfaces/autor.interface";
import { Usuario } from "../../interfaces/usuario.interface";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-pagina-inicial',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss']
})
export class PaginaInicialComponent implements OnInit, OnDestroy {
  carregando: boolean = true;
  erro: boolean = false;
  livrosPopulares: LivroDetalhes[] = [];
  autoresPopulares: AutorDetalhes[] = [];

  paginaLivros: number = 0;
  totalPaginasLivros: number = 0;
  tamanhoPaginaLivros: number = 12; // 4 colunas x 3 linhas

  // Paginação autores
  paginaAutores: number = 0;
  totalPaginasAutores: number = 0;
  tamanhoPaginaAutores: number = 12; // também 4x3


  usuarioLogado: Usuario | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private livroService: LivroService,
    private autorService: AutorService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(usuario => {
        this.usuarioLogado = usuario;
      });

    this.carregarLivrosPopulares();
    this.carregarAutoresPopulares();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarLivrosPopulares(pagina: number = 0): void {
    this.carregando = true;
    this.erro = false;
    this.livroService.listarLivrosPaginados(pagina, this.tamanhoPaginaLivros).subscribe({
      next: (res) => {
        this.livrosPopulares = res.content;
        this.paginaLivros = res.number;
        this.totalPaginasLivros = res.totalPages;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar livros populares:', err);
        this.erro = true;
        this.carregando = false;
      }
    });
  }

  carregarAutoresPopulares(pagina: number = 0): void {
    this.autorService.listarAutoresPaginados(pagina, this.tamanhoPaginaAutores).subscribe({
      next: (res) => {
        this.autoresPopulares = res.content;
        this.paginaAutores = res.number;
        this.totalPaginasAutores = res.totalPages;
      },
      error: (err) => {
        console.error('Erro ao carregar autores populares:', err);
      }
    });
  }

}
