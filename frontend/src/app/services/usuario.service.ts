import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
    providedIn: 'root'
})

export class UsuarioService {
    getById(arg0: number) {
        throw new Error('Method not implemented.');
    }
    private baseUrl = 'http://localhost:8080/api/usuarios';

    constructor(private http: HttpClient) { }

    listarUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.baseUrl}`);
    }

    buscarUsuarioPorId(id: number): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
    }
}

