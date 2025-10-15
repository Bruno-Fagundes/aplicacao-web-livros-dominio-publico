package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model;

import jakarta.persistence.*;

@Entity
@Table(name = "classificacao_livros")
public class ClassificacaoLivros {

    @EmbeddedId
    private ClassificacaoLivrosId id;

    @MapsId("livroId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livro_id", referencedColumnName = "livro_id")
    private Livro livro;

    @MapsId("usuarioId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", referencedColumnName = "usuario_id")
    private Usuario usuario;

    @Column(name = "nota")
    private Float nota;

    public ClassificacaoLivrosId getId() { return id; }
    public void setId(ClassificacaoLivrosId id) { this.id = id; }

    public Livro getLivro() { return livro; }
    public void setLivro(Livro livro) { this.livro = livro; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Float getNota() { return nota; }
    public void setNota(Float nota) { this.nota = nota; }
}
