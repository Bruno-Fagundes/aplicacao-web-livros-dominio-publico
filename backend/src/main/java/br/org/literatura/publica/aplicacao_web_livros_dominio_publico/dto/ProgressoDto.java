// src/main/java/br/org/literatura/publica/aplicacao_web_livros_dominio_publico/dto/ProgressoDto.java
package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto;

public class ProgressoDto {
    private Long livroId;
    private Integer paginaAtual;
    private Double porcentagemLida;

    public ProgressoDto() {}

    public ProgressoDto(Long livroId, Integer paginaAtual, Double porcentagemLida) {
        this.livroId = livroId;
        this.paginaAtual = paginaAtual;
        this.porcentagemLida = porcentagemLida;
    }

    public Long getLivroId() { return livroId; }
    public void setLivroId(Long livroId) { this.livroId = livroId; }

    public Integer getPaginaAtual() { return paginaAtual; }
    public void setPaginaAtual(Integer paginaAtual) { this.paginaAtual = paginaAtual; }

    public Double getPorcentagemLida() { return porcentagemLida; }
    public void setPorcentagemLida(Double porcentagemLida) { this.porcentagemLida = porcentagemLida; }
}
