import { Injectable } from '@angular/core';
import { LivroService } from './livro.service';
import { AutorService } from './autor.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { LivroDetalhes } from '../interfaces/livro.interface';
import { AutorDetalhes } from '../interfaces/autor.interface';

@Injectable({
    providedIn: 'root'
})
export class PesquisaService {

    constructor(
        private livroService: LivroService,
        private autorService: AutorService
    ) { }

    buscarLivrosPorTitulo(termo: string): Observable<LivroDetalhes[]> {
        const termoLowerCase = termo.toLowerCase();
        return this.livroService.listarLivros().pipe(
            map(livros => {
                return livros.filter(livro =>
                    livro.titulo.toLowerCase().includes(termoLowerCase)
                );
            })
        );
    }

    buscarPorTermo(termo: string): Observable<{ livros: LivroDetalhes[], autores: AutorDetalhes[] }> {
        const termoLowerCase = termo.toLowerCase();

        return forkJoin({
            livros: this.livroService.listarLivros(),
            autores: this.autorService.listarAutores()
        }).pipe(
            map(resultados => {
                const livrosEncontrados = resultados.livros.filter(livro =>
                    livro.titulo.toLowerCase().includes(termoLowerCase) ||
                    (livro.autor && livro.autor.nome.toLowerCase().includes(termoLowerCase))
                );

                const autoresEncontrados = resultados.autores.filter(autor =>
                    autor.nome.toLowerCase().includes(termoLowerCase)
                );

                return {
                    livros: livrosEncontrados,
                    autores: autoresEncontrados
                };
            })
        );
    }
}
