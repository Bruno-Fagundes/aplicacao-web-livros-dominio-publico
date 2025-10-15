import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LivroDetalhes } from '../../interfaces/livro.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-livro-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './livro-filtros.component.html',
  styleUrls: ['./livro-filtros.component.scss']
})
export class LivroFiltrosComponent implements OnInit, OnChanges {
  @Output() livrosFiltrados = new EventEmitter<any>();
  @Output() ordenacaoAlterada = new EventEmitter<string | null>();
  @Input() page: number = 0;
  @Input() size: number = 12;
  generos: string[] = [];
  subgeneros: string[] = [];
  ordenacoes = [
    { value: 'paginasAsc', label: 'Páginas ↑' },
    { value: 'paginasDesc', label: 'Páginas ↓' },
    { value: 'tituloAsc', label: 'A → Z' },
    { value: 'tituloDesc', label: 'Z → A' },
    { value: 'anoDesc', label: 'Ano (mais novo)' },
    { value: 'anoAsc', label: 'Ano (mais antigo)' },
    { value: 'notaDesc', label: 'Nota (maior)' },
    { value: 'notaAsc', label: 'Nota (menor)' },
  ];

  selectedGenero: string | null = null;
  selectedSubgenero: string | null = null;
  selectedOrdenar: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.carregarGeneros();
    this.carregarSubgeneros();
    this.buscar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['page'] && !changes['page'].firstChange) {
      this.buscar();
    }
  }

  carregarSubgeneros() {
    this.http.get<string[]>('http://localhost:8080/api/livros/subgeneros')
      .subscribe(r => this.subgeneros = r);
  }

  carregarGeneros() {
    this.http.get<string[]>('http://localhost:8080/api/livros/generos')
      .subscribe(r => this.generos = r);
  }

  onGeneroChange() {
    this.page = 0;
    if (this.selectedGenero) {
      this.http.get<string[]>(`http://localhost:8080/api/livros/subgeneros`, { params: { genero: this.selectedGenero } })
        .subscribe(r => {
          this.subgeneros = r;
          this.selectedSubgenero = null;
          this.buscar();
        });
    } else {
      this.carregarSubgeneros();
      this.selectedSubgenero = null;
      this.buscar();
    }
  }

  buscar() {
    let params = new HttpParams()
      .set('page', this.page.toString())
      .set('size', this.size.toString());

    if (this.selectedGenero) params = params.set('genero', this.selectedGenero);
    if (this.selectedSubgenero) params = params.set('subgenero', this.selectedSubgenero);
    if (this.selectedOrdenar) params = params.set('ordenar', this.selectedOrdenar);

    this.http.get<any>('http://localhost:8080/api/livros/filtrar', { params })
      .subscribe((resp) => {
        this.livrosFiltrados.emit(resp);
      });
  }

  onOrdenarChange() {
    this.page = 0;
    this.ordenacaoAlterada.emit(this.selectedOrdenar);
    this.buscar();
  }

  onSubgeneroChange() {
    this.page = 0;
    this.buscar();
  }
}