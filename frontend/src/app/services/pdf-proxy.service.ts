import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfProxyService {
  
  constructor() {}

  // Tenta recuperar o token de várias chaves comuns
  private getToken(): string | null {
    return localStorage.getItem('token') || 
           localStorage.getItem('access_token') || 
           localStorage.getItem('auth_token'); 
           // DICA: Verifique no DevTools -> Application -> Local Storage qual o nome exato da chave
  }

  getPdfBlob(pdfUrl: string): Observable<Blob> {
    console.log('🔄 PdfProxyService.getPdfBlob chamado com URL:', pdfUrl);
    
    const token = this.getToken();
    
    // 1. Configura os Headers
    const headers: any = {
      'ngrok-skip-browser-warning': 'true', // Pula o aviso do ngrok
      'Accept': 'application/pdf'
    };

    // 2. Injeta o Token Manualmente (Fundamental para evitar erro 401)
    if (token) {
      // Remove aspas extras se houver (comum em alguns storages)
      const cleanToken = token.replace(/"/g, ''); 
      headers['Authorization'] = `Bearer ${cleanToken}`;
      console.log('🔑 Token de autenticação injetado no fetch.');
    } else {
      console.warn('⚠️ Nenhum token encontrado no LocalStorage. A requisição pode falhar com 401.');
    }

    return from(
      fetch(pdfUrl, {
        method: 'GET',
        headers: headers,
        // CRÍTICO: 'omit' impede o envio de cookies automáticos.
        // Isso permite que o backend responda com 'Access-Control-Allow-Origin: *'
        // sem quebrar o CORS. A autenticação vai via header Authorization acima.
        credentials: 'omit', 
        mode: 'cors'
      })
      .then(async response => {
        console.log('📥 Resposta recebida do fetch:');
        console.log('  - Status:', response.status);
        console.log('  - URL:', response.url);

        // 3. Tratamento de Erros HTTP
        if (!response.ok) {
           if (response.status === 401) throw new Error('Não autorizado (401). Verifique o login.');
           if (response.status === 403) throw new Error('Acesso negado (403).');
           if (response.status === 404) throw new Error('PDF não encontrado (404).');
           throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        console.log('  - Content-Type:', contentType);

        // 4. Validação: É HTML do ngrok disfarçado?
        if (contentType && contentType.includes('text/html')) {
          const text = await response.text();
          console.error('❌ ERRO CRÍTICO: O servidor retornou HTML (provavelmente aviso do ngrok).');
          console.error('Início do HTML:', text.substring(0, 100));
          throw new Error('Ngrok bloqueou o acesso. Header ngrok-skip-browser-warning falhou?');
        }

        return response.blob();
      })
      .then(blob => {
        console.log('📦 Blob recebido. Tamanho:', blob.size);
        
        // 5. Validação Profunda: Checar os "Magic Bytes" do PDF
        return new Promise<Blob>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const arr = (e.target?.result as ArrayBuffer).slice(0, 5);
            const header = String.fromCharCode(...new Uint8Array(arr));
            
            // %PDF- (header padrão de pdfs)
            if (header.startsWith('%PDF')) {
               console.log('✅ Arquivo validado: É um PDF real.');
               resolve(blob);
            } else {
               console.error('❌ O arquivo baixado não parece um PDF. Header:', header);
               reject(new Error('Conteúdo inválido. O arquivo não inicia com %PDF.'));
            }
          };
          reader.onerror = () => reject(new Error('Erro ao ler blob.'));
          reader.readAsArrayBuffer(blob);
        });
      })
    );
  }

  createBlobUrl(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    console.log('🔗 URL temporária criada:', url);
    return url;
  }
}
