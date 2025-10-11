// autor-filtros.component.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-autor-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filtros-container">
      <div class="filtro-item">
        <label for="ordenar">Ordenar por:</label>
        <select id="ordenar" [(ngModel)]="selectedOrdenar" (change)="onOrdenarChange()">
          <option [ngValue]="null"></option>
          <option value="nomeAsc">Nome (A-Z)</option>
          <option value="nomeDesc">Nome (Z-A)</option>
          <option value="livrosDesc">Mais Livros</option>
          <option value="livrosAsc">Menos Livros</option>
        </select>
      </div>
    </div>
  `,
  styleUrls: ['./autor-filtros.component.scss']
})
export class AutorFiltrosComponent implements OnInit {
  @Output() ordenar = new EventEmitter<string | null>();

  selectedOrdenar: string | null = null;

  constructor() { }

  ngOnInit(): void { }

  onOrdenarChange(): void {
    this.ordenar.emit(this.selectedOrdenar);
  }
}