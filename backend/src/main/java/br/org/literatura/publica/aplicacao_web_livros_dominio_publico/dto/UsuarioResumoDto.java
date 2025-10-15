package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto;

public class UsuarioResumoDto {

    private Long usuarioId;
    private String nomeUsuario;
    private String email;
    private String fotoPerfilUrl;

    public UsuarioResumoDto() {}

    public UsuarioResumoDto(Long usuarioId, String nomeUsuario, String email, String fotoPerfilUrl) {
        this.usuarioId = usuarioId;
        this.nomeUsuario = nomeUsuario;
        this.email = email;
        this.fotoPerfilUrl = fotoPerfilUrl;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFotoPerfilUrl() {
        return fotoPerfilUrl;
    }

    public void setFotoPerfilUrl(String fotoPerfilUrl) {
        this.fotoPerfilUrl = fotoPerfilUrl;
    }
}