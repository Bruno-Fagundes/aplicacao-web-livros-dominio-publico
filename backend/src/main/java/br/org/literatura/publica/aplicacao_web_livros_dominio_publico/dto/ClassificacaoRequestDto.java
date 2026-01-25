package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto;

public class ClassificacaoRequestDto {
    private Long usuarioId;
    private Integer nota;

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }
}
