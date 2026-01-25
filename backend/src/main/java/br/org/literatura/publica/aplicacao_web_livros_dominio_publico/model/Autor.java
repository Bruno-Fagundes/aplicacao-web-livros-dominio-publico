package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "autores")
public class Autor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "autor_id")
    private Long autorId;

    private String nome;

    @Column(columnDefinition = "TEXT")
    private String biografia;
    private LocalDate dataNascimento;
    private LocalDate dataFalecimento;

    @Column(name = "url_foto")
    private String urlFoto;

    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    @OneToMany(mappedBy = "autor")
    private List<Livro> livros;

    public long getAutorId() {
        return autorId;
    }

    public void setAutorId(long autorId) {
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

    public void setUrlFoto(String url_foto) {
        this.urlFoto = url_foto;
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

    public List<Livro> getLivros() {
        return livros;
    }

    public void setLivros(List<Livro> livros) {
        this.livros = livros;
    }
}
