import { Component } from '@angular/core';
import { Usuario } from '../../interfaces/usuario.interface';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from 'express';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-autores',
  imports: [CommonModule, RouterModule],
  templateUrl: './autores.component.html',
  styleUrl: './autores.component.scss'
})
export class AutoresComponent {

  usuarioLogado: Usuario | null = null;
  private destroy$ = new Subject<void>();
  authService: any;


  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuario: Usuario | null) => {
        this.usuarioLogado = usuario;
      });
  }
}