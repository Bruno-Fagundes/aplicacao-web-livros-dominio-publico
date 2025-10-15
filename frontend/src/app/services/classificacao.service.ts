import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface EstatisticasLivroDto {
  livroId: number;
  totalAvaliacao: number;
  qtdeAvaliacao: number;
}
export interface ClassificacaoRequestDto {
  usuarioId: number;
  nota: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClassificacaoService {
  private baseUrl = 'http://localhost:8080/api/livros'; // ajuste se necessário

  constructor(private http: HttpClient) { }

  buscarEstatisticas(livroId: number): Observable<EstatisticasLivroDto> {
    return this.http.get<EstatisticasLivroDto>(`${this.baseUrl}/${livroId}/classificacao/estatisticas`);
  }

  avaliarLivro(livroId: number, dto: ClassificacaoRequestDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${livroId}/classificacao`, dto);
  }

  buscarNotaDoUsuario(livroId: number, usuarioId: number): Observable<ClassificacaoRequestDto | null> {
    return this.http
      .get<ClassificacaoRequestDto>(`${this.baseUrl}/${livroId}/classificacao/usuario/${usuarioId}`, { observe: 'response' })
      .pipe(
        map((resp: HttpResponse<ClassificacaoRequestDto>) => {
          if (resp.status === 204 || !resp.body) {
            return null;
          }
          return resp.body as ClassificacaoRequestDto;
        })
      );
  }
}
