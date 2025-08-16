import { RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { LivroService } from './services/livro.service';
import { firstValueFrom } from 'rxjs';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'pagina-inicial', renderMode: RenderMode.Prerender },
  {
    path: 'livros/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const srv = inject(LivroService);

      const livros = await firstValueFrom(srv.listarLivros());

      return livros.map(livro => ({ id: livro.livroId.toString() }));
    }
  },
  { path: '**', renderMode: RenderMode.Server }
];
