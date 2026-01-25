package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PlaylistDto {

    private long playlistId;
    private UsuarioResumoDto usuario; 
    private String titulo;
    private String descricao;
    private int qtdeLivros;
    private String imagemUrl;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
    private List<LivroDto> livros;

    public PlaylistDto(){}

    public PlaylistDto(long playlistId, String titulo) {
        this.playlistId = playlistId;
        this.titulo = titulo;
    }

    public long getPlaylistId() {
        return playlistId;
    }

    public void setPlaylistId(long playlistId) {
        this.playlistId = playlistId;
    }

    public UsuarioResumoDto getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioResumoDto usuario) {
        this.usuario = usuario;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public int getQtdeLivros() {
        return qtdeLivros;
    }

    public void setQtdeLivros(int qtdeLivros) {
        this.qtdeLivros = qtdeLivros;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public List<LivroDto> getLivros() {
        return livros;
    }

    public void setLivros(List<LivroDto> livros) {
        this.livros = livros;
    }
}