// src/app/services/autor.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutorDetalhes } from '../interfaces/autor.interface';

@Injectable({
    providedIn: 'root'
})
export class AutorService {
    private apiUrl = 'http://localhost:8080/api/autores'; // URL base da sua API de autores

    constructor(private http: HttpClient) { }

    /**
     * Busca os detalhes de um autor pelo seu ID.
     * @param id O ID do autor a ser buscado.
     * @returns Um Observable com os detalhes do autor.
     */
    buscarDetalhesAutor(id: number): Observable<AutorDetalhes> {
        return this.http.get<AutorDetalhes>(`${this.apiUrl}/${id}`);
    }

    /**
     * Lista todos os autores disponíveis.
     * @returns Um Observable com a lista de todos os autores.
     */
    listarAutores(): Observable<AutorDetalhes[]> {
        return this.http.get<AutorDetalhes[]>(`${this.apiUrl}/listar`);
    }
}
