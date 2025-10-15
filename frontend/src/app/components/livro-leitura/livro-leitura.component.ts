import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { LeituraService } from '../../services/leitura.service';
import { AuthService } from '../../services/auth.service';
import { LivroService } from '../../services/livro.service';

@Component({
  selector: 'app-livro-leitura',
  standalone: true,
  imports: [CommonModule, RouterModule, PdfViewerModule],
  templateUrl: './livro-leitura.component.html',
  styleUrls: ['./livro-leitura.component.scss']
})
export class LivroLeituraComponent implements OnInit, OnDestroy {
  public livroId = 0;
  public pdfUrl = '';
  public paginaAtual = 1;
  public totalPaginas = 0;
  public carregando = true;
  public erro = false;
  public tituloLivro = '';

  private paginaChanges$ = new Subject<number>();
  private destroy$ = new Subject<void>();
  private usuarioId: number | null = null;
  private progressoCarregado = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leituraService: LeituraService,
    private authService: AuthService,
    private livroService: LivroService
  ) { }

  ngOnInit(): void {
    this.livroId = Number(this.route.snapshot.paramMap.get('id')) || 0;

    const qpPageRaw = this.route.snapshot.queryParamMap.get('page');
    const qpPage = qpPageRaw ? Number(qpPageRaw) : 0;

    if (qpPage > 0) {
      this.paginaAtual = qpPage;
      this.progressoCarregado = true;
    }

    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(u => {
      this.usuarioId = (u as any)?.usuarioId ?? (u as any)?.id ?? null;
      console.log('Usuario ID:', this.usuarioId);
    });

    this.livroService.buscarLivroPorId(this.livroId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (dto: any) => {
        if (!dto) {
          this.erro = true;
          this.carregando = false;
          return;
        }

        if (dto.urlPdf) {
          this.pdfUrl = dto.urlPdf.startsWith('http')
            ? dto.urlPdf
            : dto.urlPdf.startsWith('/')
              ? dto.urlPdf
              : `/${dto.urlPdf}`;
        } else {
          console.error('URL do PDF não encontrada');
          this.erro = true;
          this.carregando = false;
          return;
        }

        this.tituloLivro = dto.titulo || dto.tituloLivro || dto.nome || 'Livro sem título';
        this.carregando = false;

        if (!this.progressoCarregado) {
          this.recuperarProgressoInicial();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar livro:', err);
        this.erro = true;
        this.carregando = false;
      }
    });

    this.paginaChanges$
      .pipe(debounceTime(0), takeUntil(this.destroy$))
      .subscribe(page => {
        console.log('Salvando progresso - Página:', page);
        this.salvarProgresso(page);
      });
  }

  ngOnDestroy(): void {
    this.salvarProgressoSync(this.paginaAtual);
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    this.salvarProgressoSync(this.paginaAtual);
  }

  pageLoaded(pdfDocumentProxy: any) {
    if (pdfDocumentProxy && pdfDocumentProxy.numPages) {
      this.totalPaginas = pdfDocumentProxy.numPages;
      console.log('PDF carregado. Total de páginas:', this.totalPaginas);

      if (this.paginaAtual > this.totalPaginas) {
        this.paginaAtual = this.totalPaginas;
      }
      if (this.paginaAtual < 1) {
        this.paginaAtual = 1;
      }
    }
  }

  public irParaPagina(page: number) {
    if (!page || page < 1) page = 1;
    if (this.totalPaginas && page > this.totalPaginas) page = this.totalPaginas;
    if (page === this.paginaAtual) return;

    console.log('Mudando para página:', page);
    this.paginaAtual = page;

    this.paginaChanges$.next(page);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  public irParaPaginaPrev() {
    this.irParaPagina(Math.max(1, this.paginaAtual - 1));
  }

  public irParaPaginaNext() {
    this.irParaPagina(Math.min(this.totalPaginas || 999999, this.paginaAtual + 1));
  }

  public voltarDetalhes() {
    this.router.navigate(['/livros', this.livroId]);
  }

  private recuperarProgressoInicial() {
    console.log('Recuperando progresso inicial...');

    if (this.usuarioId) {
      this.leituraService.buscarProgresso(this.livroId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (progress: any) => {
            console.log('Progresso recebido do backend:', progress);

            const paginaSalva = progress?.paginaAtual
              ?? progress?.ultimaPaginaLida
              ?? progress?.ultima_pagina_lida
              ?? progress?.pagina
              ?? null;

            if (paginaSalva && paginaSalva > 0) {
              const pagina = Number(paginaSalva);
              console.log('Restaurando página:', pagina);
              this.irParaPagina(pagina);
            } else {
              console.log('Nenhum progresso encontrado no backend');
            }
            this.progressoCarregado = true;
          },
          error: (err) => {
            console.error('Erro ao buscar progresso:', err);
            this.progressoCarregado = true;
          }
        });
    } else {
      const chave = `progresso_livro_${this.livroId}`;
      const raw = localStorage.getItem(chave);
      console.log('Progresso do localStorage:', raw);

      if (raw) {
        const pagina = Number(raw);
        if (!Number.isNaN(pagina) && pagina > 0) {
          console.log('Restaurando página do localStorage:', pagina);
          this.irParaPagina(pagina);
        }
      } else {
        console.log('Nenhum progresso encontrado no localStorage');
      }
      this.progressoCarregado = true;
    }
  }

  private salvarProgresso(pagina: number) {
    if (!pagina || pagina < 1) return;

    if (this.usuarioId) {
      this.leituraService.salvarProgresso(this.livroId, pagina)
        .subscribe({
          next: () => console.log('Progresso salvo no backend:', pagina),
          error: (err) => console.error('Erro ao salvar progresso:', err)
        });
    } else {
      const chave = `progresso_livro_${this.livroId}`;
      localStorage.setItem(chave, String(pagina));
      console.log('Progresso salvo no localStorage:', pagina);
    }
  }

  private salvarProgressoSync(pagina: number) {
    if (!pagina || pagina < 1) return;

    if (this.usuarioId) {
      try {
        const url = this.leituraService.getSalvarUrl(this.livroId);
        const dados = JSON.stringify({ paginaAtual: pagina });
        const blob = new Blob([dados], { type: 'application/json' });

        if (navigator.sendBeacon) {
          const sucesso = navigator.sendBeacon(url, blob);
          console.log('SendBeacon executado:', sucesso, 'para URL:', url);
          if (sucesso) return;
        }
      } catch (err) {
        console.error('Erro no sendBeacon:', err);
      }

      this.leituraService.salvarProgresso(this.livroId, pagina)
        .subscribe({
          next: () => console.log('Progresso salvo (fallback)'),
          error: (err) => console.error('Erro ao salvar (fallback):', err)
        });
    } else {
      const chave = `progresso_livro_${this.livroId}`;
      localStorage.setItem(chave, String(pagina));
      console.log('Progresso salvo no localStorage (sync):', pagina);
    }
  }
}