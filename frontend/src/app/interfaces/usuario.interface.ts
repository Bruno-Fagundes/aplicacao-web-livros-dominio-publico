export interface Usuario {
    id?: number;
    nomeUsuario: string;
    email: string;
    senha: string;
    confirmarSenha?: string;
    dataCadastro?: Date;
    fotoPerfilUrl?: string;
    livrosFavoritos?: any[];
    playlists?: any[];
    livrosLidos?: number;
    paginasLidas?: number;
    generoFavorito?: string;
}

// src/app/interfaces/playlist.interface.ts
export interface Playlist {
    playlistId: number;
    usuario: Usuario;
    titulo: string;
    descricao: string;
    qtdeLivros: number;
    imagemUrl: string;
    livros: Livro[];
}

// src/app/interfaces/autor.interface.ts
export interface Autor {
    autorId: number;
    nome: string;
    biografia: string;
    dataNascimento: Date;
    dataFalecimento: Date;
    urlFoto: string;
    livros: Livro[]; // Corrigido para ser uma lista de livros
}

// src/app/interfaces/livro.interface.ts
export interface Livro {
    autor: Autor; // Aparentemente, a regra é de um autor por livro
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
