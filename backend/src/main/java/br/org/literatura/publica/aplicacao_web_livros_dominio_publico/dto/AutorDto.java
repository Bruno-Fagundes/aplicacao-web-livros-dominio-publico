package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto;

public class AutorDto {

    private Long autorId;
    private String nome;

    public AutorDto() {}

    public AutorDto(Long autorId, String nome) {
        this.autorId = autorId;
        this.nome = nome;
    }

    public Long getAutorId() {
        return autorId;
    }

    public void setAutorId(Long autorId) {
        this.autorId = autorId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
