package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ClassificacaoLivrosId implements Serializable {

    @Column(name = "livro_id")
    private Long livroId;

    @Column(name = "usuario_id")
    private Long usuarioId;

    public ClassificacaoLivrosId() {}

    public ClassificacaoLivrosId(Long livroId, Long usuarioId) {
        this.livroId = livroId;
        this.usuarioId = usuarioId;
    }

    public Long getLivroId() { return livroId; }
    public void setLivroId(Long livroId) { this.livroId = livroId; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ClassificacaoLivrosId)) return false;
        ClassificacaoLivrosId that = (ClassificacaoLivrosId) o;
        return Objects.equals(livroId, that.livroId) &&
                Objects.equals(usuarioId, that.usuarioId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(livroId, usuarioId);
    }
}
