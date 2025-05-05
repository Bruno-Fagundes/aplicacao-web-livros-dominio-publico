package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Usuario {

    private long id;
    private String nomeUsuario;
    private String email;
    private String senha;
    private StatusUsuario status;
    private String funcao;
    private String fotoPerfilUrl;
    private LocalDateTime atualizadoEm;
    private LocalDateTime criadoEm;
    private LocalDateTime ultimoAcesso;

    // funcao Default USER
}
