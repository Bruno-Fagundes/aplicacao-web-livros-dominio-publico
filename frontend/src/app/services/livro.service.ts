import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LivroDetalhes } from '../interfaces/livro.interface';

@Injectable({
    providedIn: 'root'
})
export class LivroService {
    listarIdsDeLivros() {
        throw new Error('Method not implemented.');
    }
    private apiUrl = 'http://localhost:8080/api/livros';

    constructor(private http: HttpClient) { }

    buscarLivroPorId(id: number): Observable<LivroDetalhes> {
        return this.http.get<LivroDetalhes>(`${this.apiUrl}/${id}`);
    }

    obterUrlPdf(nomeArquivo: string): string {
        return `${this.apiUrl}/pdf/${nomeArquivo}`;
    }
}