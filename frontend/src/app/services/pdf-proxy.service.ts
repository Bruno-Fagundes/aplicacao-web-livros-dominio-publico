import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PdfProxyService {
  constructor(private http: HttpClient) {}

  getPdfBlob(pdfUrl: string): Observable<Blob> {
    // Usamos o HttpClient que já possui seus interceptors (Ngrok e Auth)
    // Se o NgrokInterceptor estiver funcionando, ele já adiciona o skip-warning
    return this.http.get(pdfUrl, {
      responseType: 'blob',
      // IMPORTANTE: Não enviamos headers customizados aqui para evitar o pre-flight (OPTIONS)
      // que é onde o CORS geralmente morre.
    }).pipe(
      map(blob => {
        if (blob.type === 'text/html') {
          throw new Error('Ngrok retornou HTML. Verifique o túnel.');
        }
        return blob;
      })
    );
  }

  createBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }
}
