import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario.interface';
import { AuthResponse, UsuarioLogin } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      const token = this.getToken();

      if (storedUser && token) {
        if (this.isTokenExpired(token)) {
          console.warn('Token expirado ao carregar aplicação');
          this.logout();
        } else {
          try {
            this.currentUserSubject.next(JSON.parse(storedUser));
          } catch {
            this.logout();
          }
        }
      }
    }
  }

  cadastrar(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.baseUrl}/cadastrar`, usuario);
  }

  login(credentials: UsuarioLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (this.isBrowser) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          }
          this.currentUserSubject.next(response.usuario);
        })
      );
  }

  logout(redirectToLogin: boolean = true): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');

      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('progresso_livro_')) {
          localStorage.removeItem(key);
        }
      });
    }
    this.currentUserSubject.next(null);

    if (redirectToLogin) {
      this.router.navigate(['/login'], {
        queryParams: { expired: 'true' }
      });
    }
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return expiry < now;
    } catch (err) {
      console.error('Erro ao verificar expiração do token:', err);
      return true;
    }
  }

  isTokenExpiringSoon(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      const fiveMinutes = 5 * 60;
      return (expiry - now) < fiveMinutes;
    } catch {
      return false;
    }
  }
}