package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LivroRepository  extends JpaRepository<Livro, Long> {

    @Query("SELECT l FROM Livro l JOIN FETCH l.autor WHERE l.livroId = :id")
    Optional<Livro> findByIdWithAutor(@Param("id") Long id);

    @Query("SELECT l FROM Livro l JOIN FETCH l.autor")
    List<Livro> findAllWithAutor();
}
