import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // ajuste o path se necessário
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from '../../services/usuario.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,                    // <-- torna o componente standalone
  imports: [CommonModule, RouterModule],//
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;

  usuarioLogado?: Usuario;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) { }


  ngAfterViewInit(): void {
    // define a variavel CSS quando o componente for inicializado
    this.setHeaderHeight();
  }

  @HostListener('window:resize')
  onResize(): void {
    // recalcula a altura em resize
    this.setHeaderHeight();
  }

  private setHeaderHeight(): void {
    requestAnimationFrame(() => {
      const height = this.headerEl.nativeElement.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${height}px`);
    });
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
