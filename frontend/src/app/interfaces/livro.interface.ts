export interface AutorDetalhes {
    autorId: number;
    nome: string;
    biografia: string;
    dataNascimento: Date;
    dataFalecimento: Date;
    urlFoto: string;
    livros: LivroDetalhes[];
}
export interface LivroDetalhes {
    autor: AutorDetalhes;
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
}