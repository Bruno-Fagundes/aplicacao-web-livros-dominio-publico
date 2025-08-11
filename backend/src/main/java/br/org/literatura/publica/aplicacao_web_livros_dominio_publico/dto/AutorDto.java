package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutorDto {

    private Long autorId;
    private String nome;
    private String biografia;
    private LocalDate dataNascimento;
    private LocalDate dataFalecimento;
    private String urlFoto;
    private List<LivroDto> livros;

    public AutorDto() {
    }

    public AutorDto(long autorId, String nome) {
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

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public LocalDate getDataFalecimento() {
        return dataFalecimento;
    }

    public void setDataFalecimento(LocalDate dataFalecimento) {
        this.dataFalecimento = dataFalecimento;
    }

    public String getUrlFoto() {
        return urlFoto;
    }

    public void setUrlFoto(String urlFoto) {
        this.urlFoto = urlFoto;
    }

    public List<LivroDto> getLivros() {
        return livros;
    }

    public void setLivros(List<LivroDto> livros) {
        this.livros = livros;
    }
}
