package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "leitura_usuario")
public class LeituraUsuario {

    @EmbeddedId
    private LeituraUsuarioId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("usuarioId")
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("livroId")
    @JoinColumn(name = "livro_id")
    private Livro livro;

    @Column(name = "ultima_pagina_lida")
    private Integer ultimaPaginaLida;

    private Double porcentagemLida;
    private LocalDateTime ultimaLeitura;

    public LeituraUsuarioId getId() {
        return id;
    }

    public void setId(LeituraUsuarioId id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Livro getLivro() {
        return livro;
    }

    public void setLivro(Livro livro) {
        this.livro = livro;
    }

    public Integer getUltimaPaginaLida() {
        return ultimaPaginaLida;
    }

    public void setUltimaPaginaLida(Integer ultimaPaginaLida) {
        this.ultimaPaginaLida = ultimaPaginaLida;
    }

    public Double getPorcentagemLida() {
        return porcentagemLida;
    }

    public void setPorcentagemLida(Double porcentagemLida) {
        this.porcentagemLida = porcentagemLida;
    }

    public LocalDateTime getUltimaLeitura() {
        return ultimaLeitura;
    }

    public void setUltimaLeitura(LocalDateTime ultimaLeitura) {
        this.ultimaLeitura = ultimaLeitura;
    }
}
