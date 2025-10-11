import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeituraService {
    private baseUrl = 'http://localhost:8080/api/livros';

    constructor(private http: HttpClient) { }

    buscarProgresso(livroId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${livroId}/progresso`);
    }

    salvarProgresso(livroId: number, paginaAtual: number): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/${livroId}/progresso`, {
            paginaAtual
        });
    }

    getSalvarUrl(livroId: number): string {
        return `${this.baseUrl}/${livroId}/progresso`;
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }
}