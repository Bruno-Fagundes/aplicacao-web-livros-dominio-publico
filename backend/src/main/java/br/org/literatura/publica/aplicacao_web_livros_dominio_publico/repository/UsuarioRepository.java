package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    boolean existsByNomeUsuario(String nomeUsuario);
    boolean existsByEmail(String email);

    Optional<Usuario> findByNomeUsuario(String nomeUsuario);
    Optional<Usuario> findByEmail(String email);

    // Para login “username OU email”
    @Query("SELECT u FROM Usuario u WHERE u.nomeUsuario = :ue OR u.email = :ue")
    Optional<Usuario> findByNomeUsuarioOuEmail(@Param("ue") String nomeUsuarioOuEmail);
}
