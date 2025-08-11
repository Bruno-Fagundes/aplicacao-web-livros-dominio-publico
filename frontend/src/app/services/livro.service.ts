import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LivroDetalhes } from '../interfaces/livro.interface';

@Injectable({
    providedIn: 'root'
})
export class LivroService {

    private apiUrl = 'http://localhost:8080/api/livros';

    // Método que retorna um Observable<LivroDetalhes[]>
    listarTodosOsLivros(): Observable<LivroDetalhes[]> {
        return this.http.get<LivroDetalhes[]>(`${this.apiUrl}/listar`);
    }
    constructor(private http: HttpClient) { }

    listarIdsDeLivros(): Observable<number[]> {
        // Exemplo de endpoint para listar IDs. Ajuste conforme sua API.
        return this.http.get<number[]>(`${this.apiUrl}/ids`);
    }

    buscarLivroPorId(id: number): Observable<LivroDetalhes> {
        return this.http.get<LivroDetalhes>(`${this.apiUrl}/${id}`);
    }

    obterUrlPdf(nomeArquivo: string): string {
        return `${this.apiUrl}/pdf/${nomeArquivo}`;
    }
}
