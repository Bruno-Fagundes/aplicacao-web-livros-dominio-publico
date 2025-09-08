// CriarPlaylistto.java
package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CriarPlaylistDto {

    @NotNull(message = "ID do usuário é obrigatório")
    private Long usuarioId;

    @NotBlank(message = "Título é obrigatório")
    @Size(max = 255, message = "Título deve ter no máximo 255 caracteres")
    private String titulo;

    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    private String descricao;

    @Size(max = 500, message = "URL da imagem deve ter no máximo 500 caracteres")
    private String imagemUrl;

    public CriarPlaylistDto() {}

    public CriarPlaylistDto(Long usuarioId, String titulo, String descricao, String imagemUrl) {
        this.usuarioId = usuarioId;
        this.titulo = titulo;
        this.descricao = descricao;
        this.imagemUrl = imagemUrl;
    }

    // Getters e Setters
    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
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

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }
}
