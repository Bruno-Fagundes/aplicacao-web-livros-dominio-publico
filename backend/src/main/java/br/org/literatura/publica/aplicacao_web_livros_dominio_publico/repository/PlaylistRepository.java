package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Playlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    @Query("SELECT p FROM Playlist p LEFT JOIN FETCH p.livros WHERE p.playlistId = :id")
    Optional<Playlist> findByIdWithLivros(@Param("id") Long id);

    @Query("SELECT DISTINCT p FROM Playlist p LEFT JOIN FETCH p.livros")
    List<Playlist> findAllWithLivros();

    @Query("SELECT p FROM Playlist p")
    Page<Playlist> findAllPaginated(Pageable pageable);

    @Query("SELECT p FROM Playlist p WHERE p.titulo LIKE %:titulo%")
    Page<Playlist> findByTituloContainingIgnoreCase(@Param("titulo") String titulo, Pageable pageable);

    @Query("SELECT p FROM Playlist p WHERE p.usuario.usuarioId = :usuarioId")
    Page<Playlist> findByUsuarioId(@Param("usuarioId") Long usuarioId, Pageable pageable);

    @Query("SELECT p FROM Playlist p WHERE p.titulo LIKE %:titulo% AND p.usuario.usuarioId = :usuarioId")
    Page<Playlist> findByTituloAndUsuarioId(
            @Param("titulo") String titulo,
            @Param("usuarioId") Long usuarioId,
            Pageable pageable);

    @Query("SELECT p FROM Playlist p WHERE " +
            "(:titulo IS NULL OR p.titulo LIKE %:titulo%) AND " +
            "(:usuarioId IS NULL OR p.usuario.usuarioId = :usuarioId)")
    Page<Playlist> findWithFilters(
            @Param("titulo") String titulo,
            @Param("usuarioId") Long usuarioId,
            Pageable pageable);

    @Query("SELECT p FROM Playlist p ORDER BY p.qtdeLivros DESC")
    Page<Playlist> findMostPopular(Pageable pageable);

    @Query("SELECT COUNT(p) FROM Playlist p WHERE p.usuario.usuarioId = :usuarioId")
    Long countByUsuarioId(@Param("usuarioId") Long usuarioId);

    List<Playlist> findByUsuario_UsuarioId(Long usuarioId);
    Optional<Playlist> findByPlaylistIdAndUsuario_UsuarioId(Long playlistId, Long usuarioId);
}