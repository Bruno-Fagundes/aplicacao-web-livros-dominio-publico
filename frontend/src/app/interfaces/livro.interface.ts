// src/app/interfaces/livro.interface.ts

// Nova interface para o autor
export interface AutorDetalhes {
    urlFoto: any;
    autorId: number;
    nome: string;
}

// Interface atualizada para o livro, usando a nova AutorDetalhes
export interface LivroDetalhes {
    livroId: number;
    autor: AutorDetalhes; // Agora é um objeto do tipo AutorDetalhes
    urlCapa: string;
    urlPdf: string;
    titulo: string;
    genero: string;
    subgenero: string;
    sinopse: string;
    anoPublicacao: number;
    nota: number;
    totalPaginas: number;
}