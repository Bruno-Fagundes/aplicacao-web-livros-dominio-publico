package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter 
@Setter
@ToString(exclude = {"listaDeLeituras", "playlists"})
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_id")
    private Long usuarioId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusUsuario status;

    @Enumerated(EnumType.STRING)
    @Column(name = "funcao")
    private FuncaoUsuario funcaoUsuario;

    @Column(name = "nome_usuario")
    private String nomeUsuario;

    private String email;
    private String senha;

    @Column(name = "foto_perfil_url")
    private String fotoPerfilUrl;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @Column(name = "ultimo_acesso")
    private LocalDateTime ultimoAcesso;

    @JsonIgnore
    @OneToMany(mappedBy = "usuario")
    private List<LeituraUsuario> listaDeLeituras;

    @OneToMany(mappedBy = "usuario")
    private List<Playlist> playlists;

    public Long getId() {
        return usuarioId;
    }

    public void setId(Long id) {
        this.usuarioId = id;
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

    public FuncaoUsuario getFuncao() {
        return funcaoUsuario;
    }

    public void setFuncao(FuncaoUsuario funcao) {
        this.funcaoUsuario = funcao;
    }

    public String getFotoPerfilUrl() {
        return fotoPerfilUrl;
    }

    public void setFotoPerfilUrl(String fotoPerfilUrl) {
        this.fotoPerfilUrl = "/assets/images/foto-perfil-usuario";
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

    public void setUsername(String username) {
    }
    public Object getUsername() {
        return null;
    }
}
