// A interface LivroDetalhes deve incluir o objeto AutorDetalhes
export interface LivroDetalhes {
    livroId: number;
    urlCapa: string;
    urlPdf: string;
    titulo: string;
    genero: string;
    subgenero: string;
    sinopse: string;
    anoPublicacao: number;
    nota: number;
    totalPaginas: number;
    // Propriedade autor adicionada
    autor: AutorDetalhes;
}

export interface AutorDetalhes {
    autorId: number;
    nome: string;
    biografia: string;
    dataNascimento: Date;
    dataFalecimento: Date;
    urlFoto: string;
    livros: LivroDetalhes[];
}