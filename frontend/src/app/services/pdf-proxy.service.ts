import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfProxyService {
  constructor() {}

  /**
   * Busca o PDF através do backend ngrok com os headers corretos
   * usando fetch nativo para melhor controle sobre headers e CORS
   */
  getPdfBlob(pdfUrl: string): Observable<Blob> {
    return from(
      fetch(pdfUrl, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/pdf'
        },
        credentials: 'omit', // Não envia cookies
        mode: 'cors'
      })
      .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        // Verifica se realmente é um PDF
        if (contentType && !contentType.includes('application/pdf')) {
          console.warn('Aviso: Content-Type não é application/pdf:', contentType);
        }
        
        return response.blob();
      })
    );
  }

  /**
   * Converte o Blob em uma URL local que o pdf-viewer pode usar
   */
  createBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }
}
