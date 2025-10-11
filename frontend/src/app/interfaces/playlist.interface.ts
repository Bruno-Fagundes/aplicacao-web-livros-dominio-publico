export interface Playlist {
    playlistId: number;
    usuario: UsuarioResumo;
    titulo: string;
    descricao: string | null;
    qtdeLivros: number;
    imagemUrl: string | null;
    criadoEm: string;
    atualizadoEm: string;
    livros: Livro[];
}

export interface Livro {
    livroId: number;
    urlCapa: string;
    urlPdf: string;
    titulo: string;
    genero: string;
    subgenero: string;
    sinopse: string | null;
    anoPublicacao: number | null;
    nota: number | null;
    totalPaginas: number | null;
    autor?: Autor[] | null;
    notaDoUsuario?: number | null;
}

export interface Autor {
    autorId: number;
    nome: string;
    biografia?: string | null;
    dataNascimento?: string | null;
    dataFalecimento?: string | null;
    urlFoto?: string | null;
    livros?: Livro[] | null;
}

export interface UsuarioResumo {
    usuarioId: number;
    nomeUsuario: string;
    fotoPerfilUrl?: string | null;
}