import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LivroDetalhes } from '../interfaces/livro.interface';

@Injectable({
    providedIn: 'root'
})
export class LivroService {
    private baseUrl = 'http://localhost:8080/api/livros';

    constructor(private http: HttpClient) { }

    buscarLivroPorId(id: number): Observable<LivroDetalhes> {
        return this.http.get<LivroDetalhes>(`${this.baseUrl}/${id}`);
    }

    listarLivros(): Observable<LivroDetalhes[]> {
        return this.http.get<LivroDetalhes[]>(`${this.baseUrl}`);
    }

    obterUrlPdf(nomeArquivo: string): string {
        return `${this.baseUrl}/pdf/${nomeArquivo}`;
    }

    listarLivrosPaginados(page: number, size: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/pagina?page=${page}&size=${size}`);
    }
}
