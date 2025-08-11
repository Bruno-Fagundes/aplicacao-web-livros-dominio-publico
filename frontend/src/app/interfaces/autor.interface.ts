export interface LivroDetalhes {
    livroId: number;
    titulo: string;
}

export interface AutorDetalhes {
    autorId: number;
    nome: string;
    biografia: string;
    dataNascimento: Date;
    dataFalecimentyo: Date;
    urlFoto: string;
    livros: LivroDetalhes[];
}