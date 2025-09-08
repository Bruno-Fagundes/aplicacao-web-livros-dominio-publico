// playlist.interface.ts

export interface Playlist {
    playlistId: number;
    usuario: UsuarioResumo;   // <-- objeto, não array
    titulo: string;
    descricao: string | null;
    qtdeLivros: number;
    imagemUrl: string | null;
    criadoEm: string;        // LocalDateTime vem como string no JSON
    atualizadoEm: string;    // LocalDateTime vem como string no JSON
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
    usuarioId: number;        // usa usuarioId conforme o backend
    nomeUsuario: string;
    fotoPerfilUrl?: string | null;
}
