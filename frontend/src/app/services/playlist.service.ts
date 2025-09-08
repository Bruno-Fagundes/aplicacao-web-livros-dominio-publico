import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playlist } from '../interfaces/playlist.interface';

// Esta interface de paginação é genérica e útil para vários endpoints
export interface PageResponse<T> {
    content: T[];
    pageable?: any;
    totalElements?: number;
    totalPages?: number;
    number?: number;
    size?: number;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    empty?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PlaylistService {
    private apiUrl = 'http://localhost:8080/playlists';

    constructor(private http: HttpClient) { }

    /**
     * Busca os detalhes de uma playlist por seu ID.
     * Mapeia para o endpoint GET /playlists/{id}
     */
    buscarPlaylistPorId(id: number): Observable<Playlist> {
        return this.http.get<Playlist>(`${this.apiUrl}/${id}`);
    }

    /**
     * Lista todas as playlists.
     * Mapeia para o endpoint GET /playlists
     */
    listarPlaylists(): Observable<Playlist[]> {
        return this.http.get<Playlist[]>(`${this.apiUrl}`);
    }

    /**
     * Cria uma nova playlist.
     * Mapeia para o endpoint POST /playlists
     */
    // src/app/services/playlist.service.ts
    criarPlaylist(payload: any): Observable<Playlist> {
        return this.http.post<Playlist>(`${this.apiUrl}`, payload);
    }

    /**
     * Lista playlists de um usuário específico, com paginação.
     * Mapeia para o endpoint GET /playlists/usuario/{usuarioId}
     */
    listarPlaylistsPorUsuario(usuarioId: number, page = 0, size = 50): Observable<PageResponse<Playlist>> {
        const params = new HttpParams()
            .set('page', String(page))
            .set('size', String(size));
        return this.http.get<PageResponse<Playlist>>(`${this.apiUrl}/usuario/${usuarioId}`, { params });
    }

    buscarPlaylistPorUsuarioEId(usuarioId: number, playlistId: number): Observable<Playlist> {
        return this.http.get<Playlist>(`${this.apiUrl}/usuario/${usuarioId}/playlist/${playlistId}`);
    }
}