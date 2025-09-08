// src/app/services/livro.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LivroDetalhes } from '../interfaces/livro.interface';

@Injectable({
    providedIn: 'root'
})
export class LivroService {
    private apiUrl = 'http://localhost:8080/livros';

    constructor(private http: HttpClient) { }

    buscarLivroPorId(id: number): Observable<LivroDetalhes> {
        return this.http.get<LivroDetalhes>(`${this.apiUrl}/${id}`);
    }

    listarLivros(): Observable<LivroDetalhes[]> {
        return this.http.get<LivroDetalhes[]>(`${this.apiUrl}`);
    }

    obterUrlPdf(nomeArquivo: string): string {
        return `${this.apiUrl}/pdf/${nomeArquivo}`;
    }

    listarLivrosPaginados(page: number, size: number) {
        return this.http.get<any>(`${this.apiUrl}/pagina?page=${page}&size=${size}`);
    }
}