package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.ClassificacaoLivros;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.ClassificacaoLivrosId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClassificacaoLivrosRepository extends JpaRepository<ClassificacaoLivros, ClassificacaoLivrosId> {

    @Query("SELECT COALESCE(AVG(c.nota), 0) FROM ClassificacaoLivros c WHERE c.livro.livroId = :livroId")
    Double findAverageNotaByLivroId(@Param("livroId") Long livroId);

    @Query("SELECT c.livro.livroId, COALESCE(AVG(c.nota),0) FROM ClassificacaoLivros c WHERE c.livro.livroId IN :ids GROUP BY c.livro.livroId")
    List<Object[]> findAverageNotaByLivroIds(@Param("ids") List<Long> ids);

    long countByLivro_LivroId(Long livroId);

    @Query("SELECT c FROM ClassificacaoLivros c WHERE c.livro.livroId = :livroId AND c.usuario.usuarioId = :usuarioId")
    Optional<ClassificacaoLivros> findByLivroIdAndUsuarioId(@Param("livroId") Long livroId, @Param("usuarioId") Long usuarioId);
}
