// src/app/app.routes.server.ts
import { RenderMode, PrerenderFallback, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { LivroService } from './services/livro.service'; // ajusta o caminho

export const serverRoutes: ServerRoute[] = [
  {
    path: 'livros/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client, // opcional: se um id não estiver pré-renderizado, cai para CSR
    async getPrerenderParams() {
      // Nota: inject deve ser chamado sincronamente
      const livroService = inject(LivroService);
      const ids = await livroService.listarIdsDeLivros() ?? []; // garante que ids seja um array
      return ids.map((id: any) => ({ id: String(id) })); // formato: [{id: '1'}, {id: '2'}]
    }
  }
];
