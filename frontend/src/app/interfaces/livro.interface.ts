export interface LivroDetalhes {
    idAutor: number;
    livroId: number;
    titulo: string;
    nomeAutor: string;
    genero: string;
    subgenero?: string;
    sinopse: string;
    anoPublicacao: number;
    nota: number;
    totalPaginas: number;
    urlCapa: string;
    urlPdf: string;
}