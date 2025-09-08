import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playlist } from '../interfaces/playlist.interface';

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

    buscarPlaylistPorId(id: number): Observable<Playlist> {
        return this.http.get<Playlist>(`${this.apiUrl}/${id}`);
    }

    listarPlaylists(): Observable<Playlist[]> {
        return this.http.get<Playlist[]>(`${this.apiUrl}`);
    }

    criarPlaylist(payload: any): Observable<Playlist> {
        return this.http.post<Playlist>(`${this.apiUrl}`, payload);
    }

    atualizarPlaylist(id: number, payload: any): Observable<Playlist> {
        return this.http.put<Playlist>(`${this.apiUrl}/${id}`, payload);
    }

    deletarPlaylist(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    adicionarLivroNaPlaylist(playlistId: number, livroId: number): Observable<any> {
        const url = `${this.apiUrl}/${playlistId}/livros/${livroId}`;
        return this.http.post(url, {});
    }

    listarPlaylistsPorUsuario(usuarioId: number, page = 0, size = 50): Observable<PageResponse<Playlist>> {
        const params = new HttpParams().set('page', String(page)).set('size', String(size));
        return this.http.get<PageResponse<Playlist>>(`${this.apiUrl}/usuario/${usuarioId}`, { params });
    }

    buscarPlaylistPorUsuarioEId(usuarioId: number, playlistId: number): Observable<Playlist> {
        return this.http.get<Playlist>(`${this.apiUrl}/usuario/${usuarioId}/playlist/${playlistId}`);
    }
}
