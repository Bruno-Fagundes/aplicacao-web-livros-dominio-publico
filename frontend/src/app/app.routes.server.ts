// src/app/app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { LivroService } from './services/livro.service';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },                 // prerender /
  { path: 'pagina-inicial', renderMode: RenderMode.Prerender },  // etc.
  {
    path: 'livros/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const srv = inject(LivroService);
      // Aqui tipamos explicitamente o retorno
      const ids = srv.listarIdsDeLivros() as unknown as string[];
      // Tipamos 'id' no map
      return ids.map((id: string) => ({ id }));
    }
  },
  { path: '**', renderMode: RenderMode.Server }
];
