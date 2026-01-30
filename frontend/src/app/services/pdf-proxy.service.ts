import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfProxyService {
  constructor(private http: HttpClient) {}

  /**
   * Busca o PDF através do backend ngrok com os headers corretos
   * e retorna como Blob para uso no pdf-viewer
   */
  getPdfBlob(pdfUrl: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(pdfUrl, {
      headers,
      responseType: 'blob'
    });
  }

  /**
   * Converte o Blob em uma URL local que o pdf-viewer pode usar
   */
  createBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }
}
