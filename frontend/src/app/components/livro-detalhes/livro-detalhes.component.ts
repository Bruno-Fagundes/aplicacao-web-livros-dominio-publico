import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LivroDetalhes } from '../../interfaces/livro.interface';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from '../../interfaces/usuario.interface';
import { Title } from '@angular/platform-browser';
import { ClassificacaoComponent } from '../classificacao/classificacao.component';
import { LeituraService } from '../../services/leitura.service';

@Component({
  selector: 'app-livro-detalhes',
  standalone: true,
  imports: [CommonModule, RouterModule, ClassificacaoComponent],
  templateUrl: './livro-detalhes.component.html',
  styleUrls: ['./livro-detalhes.component.scss']
})
export class LivroDetalhesComponent implements OnInit, OnDestroy {
  public livro: LivroDetalhes | null = null;
  public carregando = true;
  public erro = false;
  public usuarioLogado: Usuario | null = null;
  public isAuthenticated = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private leituraService: LeituraService,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ livro }) => {
        this.livro = livro ?? null;
        this.carregando = false;
        if (this.livro) this.title.setTitle(this.livro.titulo);
        else this.erro = true;
      },
      error: () => { this.carregando = false; this.erro = true; }
    });

    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(u => {
      this.usuarioLogado = u;
      this.isAuthenticated = !!u;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public lerDoInicio(): void {
    if (!this.livro) return;

    if (this.isAuthenticated) {
      this.leituraService.salvarProgresso(this.livro.livroId, 1).subscribe({
        next: () => {
          console.log('Progresso reiniciado para página 1');
          this.router.navigate(['/livros/leitura', this.livro!.livroId], {
            queryParams: { page: 1, reiniciar: 'true' }
          });
        },
        error: (err) => {
          console.error('Erro ao reiniciar progresso:', err);
          this.router.navigate(['/livros/leitura', this.livro!.livroId], {
            queryParams: { page: 1 }
          });
        }
      });
    } else {
      const chave = `progresso_livro_${this.livro.livroId}`;
      localStorage.setItem(chave, '1');
      this.router.navigate(['/livros/leitura', this.livro.livroId], {
        queryParams: { page: 1 }
      });
    }
  }

  public continuarLendo(): void {
    if (!this.livro) return;

    if (!this.isAuthenticated) {
      // Não autenticado - tentar recuperar do localStorage
      const chave = `progresso_livro_${this.livro.livroId}`;
      const paginaSalva = localStorage.getItem(chave);
      const page = paginaSalva ? Number(paginaSalva) : 1;

      this.router.navigate(['/livros/leitura', this.livro.livroId], {
        queryParams: { page }
      });
      return;
    }

    this.leituraService.buscarProgresso(this.livro.livroId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (progress: any) => {
          const paginaSalva = progress?.paginaAtual
            ?? progress?.ultimaPaginaLida
            ?? null;

          const page = (paginaSalva && paginaSalva > 0) ? paginaSalva : 1;

          this.router.navigate(['/livros/leitura', this.livro!.livroId], {
            queryParams: { page }
          });
        },
        error: () => {
          this.router.navigate(['/livros/leitura', this.livro!.livroId], {
            queryParams: { page: 1 }
          });
        }
      });
  }

  public get livroId(): number {
    return this.livro?.livroId ?? 0;
  }

  public get usuarioId(): number {
    return (this.usuarioLogado as any)?.usuarioId
      ?? (this.usuarioLogado as any)?.id
      ?? (this.usuarioLogado as any)?.userId
      ?? 0;
  }
}