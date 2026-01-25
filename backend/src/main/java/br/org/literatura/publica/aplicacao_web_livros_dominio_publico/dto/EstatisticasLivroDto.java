package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto;

public class EstatisticasLivroDto {
    private Long livroId;
    private Double media;  
    private Long qtdeAvaliacao;

    public EstatisticasLivroDto() {}

    public EstatisticasLivroDto(Long livroId, Double media, Long qtdeAvaliacao) {
        this.livroId = livroId;
        this.media = media;
        this.qtdeAvaliacao = qtdeAvaliacao;
    }

    public Long getLivroId() { return livroId; }
    public void setLivroId(Long livroId) { this.livroId = livroId; }

    public Double getMedia() { return media; }
    public void setMedia(Double media) { this.media = media; }

    public Long getQtdeAvaliacao() { return qtdeAvaliacao; }
    public void setQtdeAvaliacao(Long qtdeAvaliacao) { this.qtdeAvaliacao = qtdeAvaliacao; }
}
