// src/app/components/search-results/search-results.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { LivroDetalhes } from '../../interfaces/livro.interface';
import { AutorDetalhes } from '../../interfaces/autor.interface';
import { PesquisaService } from '../../services/pesquisa.service'; // Importe o novo serviço

@Component({
  selector: 'app-resultados-pesquisa',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resultados-pesquisa.component.html',
  styleUrls: ['./resultados-pesquisa.component.scss']
})
export class ResultadosPesquisaComponent implements OnInit {
  termoBusca = '';
  livrosEncontrados: LivroDetalhes[] = [];
  autoresEncontrados: AutorDetalhes[] = [];
  carregando = false;

  constructor(
    private route: ActivatedRoute,
    private pesquisaService: PesquisaService // Injete o novo serviço
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap(params => {
        this.termoBusca = params['q'] || '';
        this.carregando = true;
        // Use o novo serviço de pesquisa para buscar os dados
        return this.pesquisaService.buscarPorTermo(this.termoBusca);
      })
    ).subscribe(
      resultados => {
        this.livrosEncontrados = resultados.livros;
        this.autoresEncontrados = resultados.autores;
        this.carregando = false;
      },
      error => {
        console.error('Erro na pesquisa:', error);
        this.carregando = false;
      }
    );
  }
}