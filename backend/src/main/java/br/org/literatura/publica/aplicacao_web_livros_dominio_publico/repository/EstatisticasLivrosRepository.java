package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.EstatisticasLivros;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstatisticasLivrosRepository extends JpaRepository<EstatisticasLivros, Long> {
    Optional<EstatisticasLivros> findByLivroId(Long livroId);
}
