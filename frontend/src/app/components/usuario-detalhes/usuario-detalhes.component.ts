import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { RouterModule } from '@angular/router';
import { CommonModule, NgIfContext } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-usuario-detalhes',
  imports: [CommonModule, RouterModule],
  templateUrl: './usuario-detalhes.component.html',
  styleUrls: ['./usuario-detalhes.component.scss']
})
export class UsuarioDetalhesComponent implements OnInit, OnDestroy {
  route: any;
  title: any;
  onImageError($event: ErrorEvent) {
    throw new Error('Method not implemented.');
  }

  public usuario: Usuario | null = null;
  public usuarioLogado: Usuario | null = null;
  private destroy$ = new Subject<void>();
  loginButton!: TemplateRef<NgIfContext<UsuarioService | undefined>> | null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuario) => {
        this.usuarioLogado = usuario;
      });

    this.route.data.subscribe(({ usuario }: { usuario: Usuario }) => {
      this.usuario = usuario;
      if (!this.usuario) {
        // Handle the case where the user data is not available
        console.error('Usuário não encontrado');
      } else {
        // Set the title of the page using the user's name
        this.title.setTitle(this.usuario.nome);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
