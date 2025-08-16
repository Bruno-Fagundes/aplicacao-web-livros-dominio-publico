import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from '../../interfaces/usuario.interface';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;

  usuarioLogado?: Usuario;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngAfterViewInit(): void {
    // só tenta manipular o DOM se estivermos no browser
    if (isPlatformBrowser(this.platformId)) {
      this.setHeaderHeight();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setHeaderHeight();
    }
  }

  private setHeaderHeight(): void {
    // segurança: se não tivermos document ou o elemento ainda não existir, sair
    if (typeof document === 'undefined' || !this.headerEl?.nativeElement) {
      return;
    }

    const update = () => {
      const height = this.headerEl.nativeElement.offsetHeight;
      // checar document.documentElement por precaução
      if (document && document.documentElement && typeof document.documentElement.style !== 'undefined') {
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    // usar requestAnimationFrame quando disponível, senão fallback para setTimeout
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(update);
    } else {
      setTimeout(update, 0);
    }
  }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(u => this.usuarioLogado = u ?? undefined);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
