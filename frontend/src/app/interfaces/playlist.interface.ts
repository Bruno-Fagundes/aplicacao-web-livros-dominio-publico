export interface Playlist {
    playlistId: number;
    usuario: Usuario[];
    titulo: string;
    descricao: string;
    qtdeLivros: number;
    imagemUrl: string;
    livros: Livro[];
}

export interface Livro {
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
    autor: Autor[];
}

export interface Autor {
    autorId: number;
    nome: string;
    biografia: string;
    dataNascimento: Date;
    dataFalecimento: Date;
    urlFoto: string;
    livros: Livro[];
}

export interface Usuario {
    usuarioId: number;
    nome: string;
    email: string;
    senha: string;
    dataCadastro: Date;
    fotoPerfilUrl: "/frontend/public/assets/images/foto-perfil-usuario/foto-usuario.svg" | string;
    livrosFavoritos: Livro[];
    playlists: Playlist[];
}   