import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    listarUsuarios(): Observable<Usuario[]> {
        // Replace with actual implementation
        return of([]);
    }
}

export type { Usuario };
