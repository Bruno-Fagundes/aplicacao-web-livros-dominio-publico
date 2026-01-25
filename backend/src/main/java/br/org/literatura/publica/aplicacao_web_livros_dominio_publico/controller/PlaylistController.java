package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.AtualizarPlaylistDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.CriarPlaylistDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.PlaylistDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

    @GetMapping("")
    public List<PlaylistDto> listarTodasAsPlaylists() {
        return playlistService.listarTodasAsPlaylists();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlaylistDto> buscarPlaylistPorId(@PathVariable Long id) {
        Optional<PlaylistDto> playlist = playlistService.buscarDetalhesPlaylist(id);
        return playlist.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("")
    public ResponseEntity<PlaylistDto> criarPlaylist(@Valid @RequestBody CriarPlaylistDto playlistCreateDto) {
        try {
            PlaylistDto playlistCriada = playlistService.criarPlaylist(playlistCreateDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(playlistCriada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/pagina")
    public ResponseEntity<Page<PlaylistDto>> listarPlaylistsPaginadas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "criadoEm") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) Long usuarioId) {

        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<PlaylistDto> playlists = playlistService.listarPlaylistsPaginadas(
                pageable, titulo, usuarioId);

        return ResponseEntity.ok(playlists);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlaylistDto> editarPlaylist(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarPlaylistDto playlistUpdateDto) {
        try {
            Optional<PlaylistDto> playlistAtualizada = playlistService.editarPlaylist(id, playlistUpdateDto);
            return playlistAtualizada
                    .map(playlist -> ResponseEntity.ok(playlist))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPlaylist(@PathVariable Long id) {
        try {
            boolean deletada = playlistService.deletarPlaylist(id);
            return deletada
                    ? ResponseEntity.noContent().build()
                    : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{playlistId}/livros/{livroId}")
    public ResponseEntity<PlaylistDto> adicionarLivroNaPlaylist(
            @PathVariable Long playlistId,
            @PathVariable Long livroId) {
        try {
            Optional<PlaylistDto> playlistAtualizada = playlistService.adicionarLivroNaPlaylist(playlistId, livroId);
            return playlistAtualizada
                    .map(playlist -> ResponseEntity.ok(playlist))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{playlistId}/livros/{livroId}")
    public ResponseEntity<PlaylistDto> removerLivroDaPlaylist(
            @PathVariable Long playlistId,
            @PathVariable Long livroId) {
        try {
            Optional<PlaylistDto> playlistAtualizada = playlistService.removerLivroDaPlaylist(playlistId, livroId);
            return playlistAtualizada
                    .map(playlist -> ResponseEntity.ok(playlist))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<PlaylistDto>> listarPlaylistsPorUsuarioPaginado(
            @PathVariable Long usuarioId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "criadoEm") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        try {
            Sort.Direction direction = sortDirection.equalsIgnoreCase("desc")
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;

            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            Page<PlaylistDto> playlists = playlistService.listarPlaylistsPaginadas(
                    pageable, null, usuarioId);

            return ResponseEntity.ok(playlists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/usuario/{usuarioId}/playlist/{playlistId}")
    public ResponseEntity<PlaylistDto> buscarPlaylistDoUsuario(
            @PathVariable Long usuarioId,
            @PathVariable Long playlistId) {
        try {
            Optional<PlaylistDto> playlist = playlistService.buscarPlaylistDoUsuario(usuarioId, playlistId);
            return playlist.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}