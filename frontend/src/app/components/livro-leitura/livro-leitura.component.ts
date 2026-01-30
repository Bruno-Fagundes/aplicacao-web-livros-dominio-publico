import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Adicionado para download binário
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { LeituraService } from '../../services/leitura.service';
import { AuthService } from '../../services/auth.service';
import { LivroService } from '../../services/livro.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-livro-leitura',
  standalone: true,
  imports: [CommonModule, RouterModule, PdfViewerModule],
  templateUrl: './livro-leitura.component.html',
  styleUrls: ['./livro-leitura.component.scss']
})
export class LivroLeituraComponent implements OnInit, OnDestroy {
  public livroId = 0;
  public pdfUrl: any = ''; // Alterado para aceitar URL de objeto (Blob)
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
    private livroService: LivroService,
    private http: HttpClient // Injetado para ativar os interceptores no download
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
          let urlFinal = dto.urlPdf;
          
          // Normalizar diferentes formatos de URL para o padrão /api/livros/pdfs/
          if (urlFinal.startsWith('/pdfs/livros/')) {
            urlFinal = urlFinal.replace('/pdfs/livros/', '/api/livros/pdfs/');
          } else if (urlFinal.startsWith('/livros/pdf/')) {
            urlFinal = urlFinal.replace('/livros/pdf/', '/api/livros/pdfs/');
          } else if (urlFinal.startsWith('/pdf/livros/')) {
            urlFinal = urlFinal.replace('/pdf/livros/', '/api/livros/pdfs/');
          }

          const fullUrl = urlFinal.startsWith('http')
            ? urlFinal
            : `${environment.apiUrl}${urlFinal.startsWith('/') ? urlFinal : '/' + urlFinal}`;
          
          console.log('Iniciando download seguro do PDF:', fullUrl);
          this.baixarPdfComoBlob(fullUrl); // Chamada do método corrigido
        } else {
          console.error('URL do PDF não encontrada');
          this.erro = true;
          this.carregando = false;
          return;
        }

        this.tituloLivro = dto.titulo || dto.tituloLivro || dto.nome || 'Livro sem título';

        if (!this.progressoCarregado) {
          this.recuperarProgressoInicial();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar metadados do livro:', err);
        this.erro = true;
        this.carregando = false;
      }
    });

    this.paginaChanges$
      .pipe(debounceTime(500), takeUntil(this.destroy$)) // Aumentado debounce para evitar spam
      .subscribe(page => {
        console.log('Salvando progresso - Página:', page);
        this.salvarProgresso(page);
      });
  }

  // MÉTODO NOVO: Baixa o arquivo via HttpClient para disparar os Interceptors
  private baixarPdfComoBlob(url: string) {
    this.carregando = true;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        // Cria uma URL local segura para o binário baixado
        this.pdfUrl = URL.createObjectURL(blob);
        this.carregando = false;
        console.log('✅ PDF baixado e processado com sucesso.');
      },
      error: (err) => {
        console.error('❌ Erro ao baixar arquivo PDF (Provável 403 ou Ngrok):', err);
        this.erro = true;
        this.carregando = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.salvarProgressoSync(this.paginaAtual);
    this.destroy$.next();
    this.destroy$.complete();
    
    // Limpeza de memória: revoga a URL do blob ao fechar o componente
    if (this.pdfUrl && typeof this.pdfUrl === 'string' && this.pdfUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.pdfUrl);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    this.salvarProgressoSync(this.paginaAtual);
  }

  pageLoaded(pdfDocumentProxy: any) {
    if (pdfDocumentProxy && pdfDocumentProxy.numPages) {
      this.totalPaginas = pdfDocumentProxy.numPages;
      console.log('PDF renderizado. Total de páginas:', this.totalPaginas);

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
    if (this.usuarioId) {
      this.leituraService.buscarProgresso(this.livroId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (progress: any) => {
            const paginaSalva = progress?.paginaAtual ?? progress?.ultimaPaginaLida ?? null;
            if (paginaSalva && paginaSalva > 0) {
              this.paginaAtual = Number(paginaSalva);
            }
            this.progressoCarregado = true;
          },
          error: () => this.progressoCarregado = true
        });
    } else {
      const raw = localStorage.getItem(`progresso_livro_${this.livroId}`);
      if (raw) this.paginaAtual = Number(raw);
      this.progressoCarregado = true;
    }
  }

  private salvarProgresso(pagina: number) {
    if (!pagina || pagina < 1) return;
    if (this.usuarioId) {
      this.leituraService.salvarProgresso(this.livroId, pagina).subscribe();
    } else {
      localStorage.setItem(`progresso_livro_${this.livroId}`, String(pagina));
    }
  }

  private salvarProgressoSync(pagina: number) {
    if (!pagina || pagina < 1) return;
    if (this.usuarioId) {
      try {
        const url = this.leituraService.getSalvarUrl(this.livroId);
        const dados = JSON.stringify({ paginaAtual: pagina });
        const blob = new Blob([dados], { type: 'application/json' });
        if (navigator.sendBeacon) navigator.sendBeacon(url, blob);
      } catch (err) {
        console.error('Erro sync:', err);
      }
    } else {
      localStorage.setItem(`progresso_livro_${this.livroId}`, String(pagina));
    }
  }
}
