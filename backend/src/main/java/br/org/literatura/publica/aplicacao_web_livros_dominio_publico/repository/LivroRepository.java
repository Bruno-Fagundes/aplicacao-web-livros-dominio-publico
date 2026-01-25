package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Livro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LivroRepository  extends JpaRepository<Livro, Long>, JpaSpecificationExecutor<Livro> {

    @Query("SELECT l FROM Livro l JOIN FETCH l.autor WHERE l.livroId = :id")
    Optional<Livro> findByIdWithAutor(@Param("id") Long id);

    @Query("SELECT l FROM Livro l JOIN FETCH l.autor")
    List<Livro> findAllWithAutor();

    @Override
    @EntityGraph(attributePaths = {"autor"})
    Page<Livro> findAll(Pageable pageable);

    @Query("SELECT DISTINCT l.genero FROM Livro l WHERE l.genero IS NOT NULL ORDER BY l.genero")
    List<String> findDistinctGeneros();

    @Query("SELECT DISTINCT l.subgenero FROM Livro l WHERE l.genero = :genero AND l.subgenero IS NOT NULL ORDER BY l.subgenero")
    List<String> findDistinctSubgenerosByGenero(@Param("genero") String genero);

    @Query("SELECT DISTINCT l.subgenero FROM Livro l WHERE l.subgenero IS NOT NULL ORDER BY l.subgenero")
    List<String> findDistinctSubgeneros();

}
