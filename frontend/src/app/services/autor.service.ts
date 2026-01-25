// src/app/services/autor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutorDetalhes } from '../interfaces/autor.interface';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class AutorService {
     private baseUrl = `${environment.apiUrl}/api/autores`;

	currentUser$: any;

    constructor(private http: HttpClient) { }

    buscarDetalhesAutor(id: number): Observable<AutorDetalhes> {
        return this.http.get<AutorDetalhes>(`${this.baseUrl}/${id}`);
    }

    listarAutores(): Observable<AutorDetalhes[]> {
        return this.http.get<AutorDetalhes[]>(`${this.baseUrl}`);
    }

    listarAutoresPaginados(page: number, size: number) {
        return this.http.get<any>(`${this.baseUrl}/pagina?page=${page}&size=${size}`);
    }
}
