import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { LeituraService } from '../../services/leitura.service';
import { AuthService } from '../../services/auth.service';
import { LivroService } from '../../services/livro.service';
import { PdfProxyService } from '../../services/pdf-proxy.service';
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
  public pdfUrl: string | Blob = ''; // Pode ser URL ou Blob
  public paginaAtual = 1;
  public totalPaginas = 0;
  public carregando = true;
  public erro = false;
  public tituloLivro = '';

  private paginaChanges$ = new Subject<number>();
  private destroy$ = new Subject<void>();
  private usuarioId: number | null = null;
  private progressoCarregado = false;
  private blobUrl: string | null = null; // Para revogar depois

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leituraService: LeituraService,
    private authService: AuthService,
    private livroService: LivroService,
    private pdfProxyService: PdfProxyService
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
          
          console.log('URL original do backend:', urlFinal);
          
          // Normalizar diferentes formatos de URL para o padrão /api/livros/pdf/ (SEM 's')
          if (urlFinal.startsWith('/pdfs/livros/')) {
            urlFinal = urlFinal.replace('/pdfs/livros/', '/api/livros/pdf/');
          } else if (urlFinal.startsWith('/livros/pdf/')) {
            urlFinal = urlFinal.replace('/livros/pdf/', '/api/livros/pdf/');
          } else if (urlFinal.startsWith('/pdf/livros/')) {
            urlFinal = urlFinal.replace('/pdf/livros/', '/api/livros/pdf/');
          } else if (urlFinal.startsWith('/api/livros/pdfs/')) {
            // Corrigir URLs antigas que usavam /pdfs/ com 's'
            urlFinal = urlFinal.replace('/api/livros/pdfs/', '/api/livros/pdf/');
          } else if (!urlFinal.startsWith('/api/livros/pdf/') && !urlFinal.startsWith('http')) {
            // Se não tem nenhum prefixo conhecido, adicionar o padrão
            urlFinal = '/api/livros/pdf/' + urlFinal.replace(/^\/+/, '');
          }

          // Construir URL completa com environment.apiUrl se não for HTTP
          const pdfUrlCompleta = urlFinal.startsWith('http')
            ? urlFinal
            : `${environment.apiUrl}${urlFinal.startsWith('/') ? urlFinal : '/' + urlFinal}`;
          
          console.log('PDF URL final:', pdfUrlCompleta);

          // Carregar o PDF através do proxy service
private carregarPdfComHeaders(url: string): void {
  console.log('Carregando PDF através do proxy service...');
  
  this.pdfProxyService.getPdfBlob(url)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (blob) => {
        console.log('PDF baixado com sucesso. Tamanho:', blob.size);
        
        // Criar uma URL local do Blob
        this.blobUrl = URL.createObjectURL(blob);
        
        // ✅ IMPORTANTE: Use a Blob URL, não o Blob diretamente
        this.pdfUrl = this.blobUrl; // MUDANÇA AQUI!
        
        console.log('Blob URL criada:', this.blobUrl);
        
        this.carregando = false;

        if (!this.progressoCarregado) {
          this.recuperarProgressoInicial();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar PDF:', err);
        this.erro = true;
        this.carregando = false;
      }
    });
}

        this.tituloLivro = dto.titulo || dto.tituloLivro || dto.nome || 'Livro sem título';
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

  private carregarPdfComHeaders(url: string): void {
    console.log('Carregando PDF através do proxy service...');
    
    this.pdfProxyService.getPdfBlob(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          console.log('PDF baixado com sucesso. Tamanho:', blob.size);
          
          // Criar uma URL local do Blob
          this.blobUrl = this.pdfProxyService.createBlobUrl(blob);
          this.pdfUrl = blob; // O pdf-viewer aceita tanto URL quanto Blob
          
          console.log('Blob URL criada:', this.blobUrl);
          
          this.carregando = false;

          if (!this.progressoCarregado) {
            this.recuperarProgressoInicial();
          }
        },
        error: (err) => {
          console.error('Erro ao carregar PDF:', err);
          this.erro = true;
          this.carregando = false;
        }
      });
  }

  ngOnDestroy(): void {
    // Revogar a Blob URL para liberar memória
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
      console.log('Blob URL revogada');
    }

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
