package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.StatusUsuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UsuarioDto {

    private Long id;
    private String nomeUsuario;
    private String email;

    @JsonIgnore
    private String senha;

    private StatusUsuario status;
    private String funcao;
    private String fotoPerfilUrl;
    private LocalDateTime atualizadoEm;
    private LocalDateTime criadoEm;
    private LocalDateTime ultimoAcesso;
    private List<PlaylistDto> playlists;

    public UsuarioDto() {
        super();
    }

    public UsuarioDto(Long id, String nomeUsuario, String email, StatusUsuario status, String funcao) {
        this.id = id;
        this.nomeUsuario = nomeUsuario;
        this.email = email;
        this.status = status;
        this.funcao = funcao;
        this.fotoPerfilUrl = "/assets/images/foto-perfil-usuario/foto-perfil.png";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public StatusUsuario getStatus() {
        return status;
    }

    public void setStatus(StatusUsuario status) {
        this.status = status;
    }

    public String getFuncao() {
        return funcao;
    }

    public void setFuncao(String funcao) {
        this.funcao = funcao;
    }

    public String getFotoPerfilUrl() {
        return fotoPerfilUrl;
    }

    public void setFotoPerfilUrl(String fotoPerfilUrl) {
        this.fotoPerfilUrl = fotoPerfilUrl;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getUltimoAcesso() {
        return ultimoAcesso;
    }

    public void setUltimoAcesso(LocalDateTime ultimoAcesso) {
        this.ultimoAcesso = ultimoAcesso;
    }

    public List<PlaylistDto> getPlaylists() {
        return playlists;
    }

    public void setPlaylists(List<PlaylistDto> playlists) {
        this.playlists = playlists;
    }
}