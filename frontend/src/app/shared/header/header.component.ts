// src/app/components/header/header.component.ts
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Usuario } from '../../interfaces/usuario.interface';
import { RouterModule, Router, NavigationEnd } from '@angular/router'; // ⭐️ Importe NavigationEnd
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PesquisaService } from '../../services/pesquisa.service';
import { LivroDetalhes } from '../../interfaces/livro.interface';
import { AutorDetalhes } from '../../interfaces/autor.interface';
import { filter } from 'rxjs/operators'; // ⭐️ Importe o operador filter

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;

  usuarioLogado?: Usuario;
  private destroy$ = new Subject<void>();

  termoBusca: string = '';
  mostrarSugestoes = false;
  sugestoesLivros: LivroDetalhes[] = [];
  sugestoesAutores: AutorDetalhes[] = [];

  private termoBusca$ = new Subject<string>();

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private pesquisaService: PesquisaService
  ) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setHeaderHeight();
      window.addEventListener('resize', this.setHeaderHeight);
    }
  }

  private setHeaderHeight = () => {
    if (this.headerEl && isPlatformBrowser(this.platformId)) {
      const headerHeight = this.headerEl.nativeElement.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setHeaderHeight();
  }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(u => this.usuarioLogado = u ?? undefined);

    this.termoBusca$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(termo => {
      if (termo.length >= 1) {
        this.pesquisaService.buscarPorTermo(termo).subscribe(resultados => {
          this.sugestoesLivros = resultados.livros.slice(0, 5);
          this.sugestoesAutores = resultados.autores.slice(0, 5);
          this.mostrarSugestoes = this.sugestoesLivros.length > 0 || this.sugestoesAutores.length > 0;
        });
      } else {
        this.limparSugestoes();
      }
    });

    // ⭐️ Adicione a inscrição para o evento de navegação
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // Quando a navegação termina, limpe o termo de busca
      this.termoBusca = '';
      this.limparSugestoes();
    });
  }

  onTyping(): void {
    this.termoBusca$.next(this.termoBusca);
  }

  onSugestaoClick(tipo: 'livro' | 'autor', id: number): void {
    if (tipo === 'livro') {
      this.router.navigate(['/livros', id]);
    } else if (tipo === 'autor') {
      this.router.navigate(['/autores', id]);
    }
    this.limparSugestoes();
  }

  onPesquisar(): void {
    if (this.termoBusca.trim() !== '') {
      this.router.navigate(['/pesquisa'], { queryParams: { q: this.termoBusca } });
      this.limparSugestoes();
    }
  }

  limparSugestoes(): void {
    this.mostrarSugestoes = false;
    this.sugestoesLivros = [];
    this.sugestoesAutores = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.setHeaderHeight);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
} 