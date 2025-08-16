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

  carregarLivrosPopulares(): void {
    this.carregando = true;
    this.erro = false;
    this.livroService.listarLivros().subscribe({
      next: (livros) => {
        this.livrosPopulares = livros;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar livros populares:', err);
        this.erro = true;
        this.carregando = false;
      }
    });
  }

  carregarAutoresPopulares(): void {
    this.autorService.listarAutores().subscribe({
      next: (autores) => {
        this.autoresPopulares = autores;
      },
      error: (err) => {
        console.error('Erro ao carregar autores populares:', err);
      }
    });
  }
}
