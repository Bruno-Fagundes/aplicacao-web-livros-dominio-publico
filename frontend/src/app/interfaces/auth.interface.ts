import { Usuario } from "./usuario.interface";

export interface UsuarioLogin {
    nomeUsuarioOuEmail: string;
    senha: string;
}

export interface AuthResponse {
    token: string;
    usuario: Usuario;
}
