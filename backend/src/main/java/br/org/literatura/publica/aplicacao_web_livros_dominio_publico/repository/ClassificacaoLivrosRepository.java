package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.ClassificacaoLivros;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.ClassificacaoLivrosId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClassificacaoLivrosRepository extends JpaRepository<ClassificacaoLivros, ClassificacaoLivrosId> {

    @Query("SELECT COALESCE(AVG(c.nota), 0) FROM ClassificacaoLivros c WHERE c.livro.livroId = :livroId")
    Double findAverageNotaByLivroId(@Param("livroId") Long livroId);


    // novo: medias para vários ids (retorna lista de [livroId, avg])
    @Query("SELECT c.livro.livroId, COALESCE(AVG(c.nota),0) FROM ClassificacaoLivros c WHERE c.livro.livroId IN :ids GROUP BY c.livro.livroId")
    List<Object[]> findAverageNotaByLivroIds(@Param("ids") List<Long> ids);
}
