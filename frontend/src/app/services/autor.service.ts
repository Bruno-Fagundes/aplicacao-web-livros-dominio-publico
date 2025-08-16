import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutorDetalhes } from '../interfaces/autor.interface';

@Injectable({
    providedIn: 'root'
})
export class AutorService {
    private apiUrl = 'http://localhost:8080/api/autores'; // URL base da sua API de autores
    currentUser$: any;

    constructor(private http: HttpClient) { }

    buscarDetalhesAutor(id: number): Observable<AutorDetalhes> {
        return this.http.get<AutorDetalhes>(`${this.apiUrl}/${id}`);
    }

    listarAutores(): Observable<AutorDetalhes[]> {
        return this.http.get<AutorDetalhes[]>(`${this.apiUrl}/listar`);
    }
}
