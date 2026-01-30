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
    console.log('🔄 PdfProxyService.getPdfBlob chamado com URL:', pdfUrl);
    
    return from(
      fetch(pdfUrl, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/pdf'
        },
        credentials: 'omit',
        mode: 'cors'
      })
      .then(response => {
        console.log('📥 Resposta recebida:');
        console.log('  - Status:', response.status, response.statusText);
        console.log('  - Headers:', Object.fromEntries(response.headers.entries()));
        console.log('  - OK:', response.ok);
        console.log('  - Type:', response.type);
        console.log('  - URL:', response.url);
        
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        
        console.log('  - Content-Type:', contentType);
        console.log('  - Content-Length:', contentLength);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Verificar se é HTML (página de erro do ngrok)
        if (contentType && contentType.includes('text/html')) {
          console.error('❌ ERRO: Resposta é HTML, não PDF!');
          console.error('   Isso significa que o ngrok está retornando a página de aviso.');
          throw new Error('Ngrok retornou HTML ao invés de PDF. Configure o authtoken do ngrok.');
        }
        
        // Verificar se é PDF
        if (contentType && !contentType.includes('application/pdf')) {
          console.warn('⚠️ AVISO: Content-Type não é application/pdf:', contentType);
        }
        
        return response.blob();
      })
      .then(blob => {
        console.log('📦 Blob criado:');
        console.log('  - Tamanho:', blob.size, 'bytes');
        console.log('  - Tipo:', blob.type);
        
        // Verificar os primeiros bytes do blob para confirmar que é PDF
        return new Promise<Blob>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer.slice(0, 5));
            const header = String.fromCharCode(...uint8Array);
            
            console.log('  - Header (primeiros 5 bytes):', header);
            console.log('  - Bytes (hex):', Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join(' '));
            
            if (header.startsWith('%PDF')) {
              console.log('✅ CONFIRMADO: Arquivo é um PDF válido!');
              resolve(blob);
            } else {
              console.error('❌ ERRO: Arquivo NÃO é um PDF!');
              console.error('   Header esperado: %PDF-');
              console.error('   Header recebido:', header);
              
              // Ler mais para debug
              const moreReader = new FileReader();
              moreReader.onload = (e2) => {
                const text = (e2.target?.result as string).substring(0, 500);
                console.error('   Conteúdo (primeiros 500 chars):', text);
              };
              moreReader.readAsText(blob.slice(0, 500));
              
              reject(new Error('Arquivo baixado não é um PDF válido. Verifique se o ngrok está configurado corretamente.'));
            }
          };
          reader.onerror = () => {
            console.error('❌ Erro ao ler o blob');
            reject(new Error('Erro ao verificar o conteúdo do PDF'));
          };
          reader.readAsArrayBuffer(blob.slice(0, 5));
        });
      })
      .catch(error => {
        console.error('❌ ERRO no getPdfBlob:', error);
        throw error;
      })
    );
  }

  /**
   * Converte o Blob em uma URL local que o pdf-viewer pode usar
   */
  createBlobUrl(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    console.log('🔗 Blob URL criada:', url);
    return url;
  }
}
