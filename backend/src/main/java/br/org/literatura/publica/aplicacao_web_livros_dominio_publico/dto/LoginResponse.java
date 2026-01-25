package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private UsuarioDto usuario;
}