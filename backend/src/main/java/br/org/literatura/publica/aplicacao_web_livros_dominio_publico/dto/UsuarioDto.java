package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.StatusUsuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Usuario;

import java.time.LocalDateTime;

public class UsuarioDto {

    private Long id;
    private String nomeUsuario;
    private String email;
    private String senha;
    private StatusUsuario status;
    private String funcao;
    private String fotoPerfilUrl;
    private LocalDateTime atualizadoEm;
    private LocalDateTime criadoEm;
    private LocalDateTime ultimoAcesso;

    public UsuarioDto (Usuario usuario) {
        super();
        this.nomeUsuario = usuario.getNomeUsuario();
        this.email = usuario.getEmail();
        this.senha = usuario.getSenha();
        this.status = usuario.getStatus();
        this.funcao = "USER";
        this.fotoPerfilUrl = "frontend/src/assets/images/foto-perfil-usuario/foto-perfil.png";
        this.atualizadoEm = usuario.getAtualizadoEm();
        this.criadoEm = usuario.getCriadoEm();
        this.ultimoAcesso = usuario.getUltimoAcesso();
    }
}
