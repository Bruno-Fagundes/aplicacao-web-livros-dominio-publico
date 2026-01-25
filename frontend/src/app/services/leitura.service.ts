import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class LeituraService {
    private baseUrl = `${environment.apiUrl}/api/livros`;

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
