import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LivroDetalhes } from '../interfaces/livro.interface';

@Injectable({
    providedIn: 'root'
})

export class LivroService {
    private apiUrl = 'http://localhost:8080/api/livros';

    listarLivros(): Observable<LivroDetalhes[]> {
        return this.http.get<LivroDetalhes[]>(`${this.apiUrl}/listar`);
    }
    constructor(private http: HttpClient) { }

    buscarLivroPorId(id: number): Observable<LivroDetalhes> {
        return this.http.get<LivroDetalhes>(`${this.apiUrl}/${id}`);
    }

    obterUrlPdf(nomeArquivo: string): string {
        return `${this.apiUrl}/pdf/${nomeArquivo}`;
    }
}
