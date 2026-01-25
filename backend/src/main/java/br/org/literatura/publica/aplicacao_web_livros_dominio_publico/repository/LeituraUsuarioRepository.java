package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.LeituraUsuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.LeituraUsuarioId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LeituraUsuarioRepository extends JpaRepository<LeituraUsuario, LeituraUsuarioId> {
    Optional<LeituraUsuario> findByIdUsuarioIdAndIdLivroId(Long usuarioId, Long livroId);
}
