package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.*;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Livro;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Playlist;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Usuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.PlaylistRepository;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.UsuarioRepository;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.LivroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final UsuarioRepository usuarioRepository;
    private final LivroRepository livroRepository;
    
    // Imagem padrão para playlists sem imagem personalizada
    private static final String IMAGEM_PADRAO = "assets/images/capa-playlist/capa-playlist.svg";

    private PlaylistDto converterParaPlaylistDto(Playlist playlist) {
        if (playlist == null) {
            return null;
        }

        PlaylistDto dto = new PlaylistDto();
        dto.setPlaylistId(playlist.getPlaylistId());
        dto.setAtualizadoEm(playlist.getAtualizadoEm());
        dto.setCriadoEm(playlist.getCriadoEm());
        dto.setUsuario(converterUsuarioParaResumo(playlist.getUsuario()));
        dto.setQtdeLivros(playlist.getQtdeLivros());
        dto.setTitulo(playlist.getTitulo());
        dto.setImagemUrl(playlist.getImagemUrl());
        dto.setDescricao(playlist.getDescricao());

        List<LivroDto> livrosDto = playlist.getLivros() != null
                ? playlist.getLivros().stream()
                .map(this::converterParaLivroDto)
                .collect(Collectors.toList())
                : Collections.emptyList();

        dto.setLivros(livrosDto);
        return dto;
    }

    public Optional<PlaylistDto> buscarDetalhesPlaylist(Long id) {
        return playlistRepository.findByIdWithLivros(id)
                .map(this::converterParaPlaylistDto);
    }

    public List<PlaylistDto> listarTodasAsPlaylists() {
        List<Playlist> playlists = playlistRepository.findAll();
        return playlists.stream()
                .map(this::converterParaPlaylistDto)
                .collect(Collectors.toList());
    }

    public Page<PlaylistDto> listarPlaylistsPaginadas(
            Pageable pageable,
            String titulo,
            Long usuarioId) {

        Page<Playlist> playlists = playlistRepository.findWithFilters(titulo, usuarioId, pageable);
        return playlists.map(this::converterParaPlaylistDto);
    }

    public Page<PlaylistDto> listarPlaylistsPopulares(Pageable pageable) {
        Page<Playlist> playlists = playlistRepository.findMostPopular(pageable);
        return playlists.map(this::converterParaPlaylistDto);
    }

    public Page<PlaylistDto> listarPlaylistsPorUsuario(Long usuarioId, Pageable pageable) {
        Page<Playlist> playlists = playlistRepository.findByUsuarioId(usuarioId, pageable);
        return playlists.map(this::converterParaPlaylistDto);
    }

    @Transactional
    public PlaylistDto criarPlaylist(CriarPlaylistDto playlistCreateDto) {
        Usuario usuario = usuarioRepository.findById(playlistCreateDto.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com ID: " + playlistCreateDto.getUsuarioId()));

        Playlist novaPlaylist = new Playlist();
        novaPlaylist.setUsuario(usuario);
        novaPlaylist.setTitulo(playlistCreateDto.getTitulo());
        novaPlaylist.setDescricao(playlistCreateDto.getDescricao());
        
        // Define a imagem: usa a fornecida pelo usuário ou a padrão
        String imagemUrl = playlistCreateDto.getImagemUrl();
        if (imagemUrl == null || imagemUrl.trim().isEmpty()) {
            imagemUrl = IMAGEM_PADRAO;
        }
        novaPlaylist.setImagemUrl(imagemUrl);
        
        novaPlaylist.setQtdeLivros(0); 
        novaPlaylist.setCriadoEm(LocalDateTime.now());
        novaPlaylist.setAtualizadoEm(LocalDateTime.now());

        Playlist playlistSalva = playlistRepository.save(novaPlaylist);
        return converterParaPlaylistDto(playlistSalva);
    }

    @Transactional
    public Optional<PlaylistDto> editarPlaylist(Long id, AtualizarPlaylistDto playlistUpdateDto) {
        return playlistRepository.findById(id)
                .map(playlist -> {
                    if (playlistUpdateDto.getTitulo() != null && !playlistUpdateDto.getTitulo().trim().isEmpty()) {
                        playlist.setTitulo(playlistUpdateDto.getTitulo());
                    }
                    if (playlistUpdateDto.getDescricao() != null) {
                        playlist.setDescricao(playlistUpdateDto.getDescricao());
                    }
                    // IMPORTANTE: Só atualiza a imagem se for explicitamente fornecida
                    if (playlistUpdateDto.getImagemUrl() != null) {
                        playlist.setImagemUrl(playlistUpdateDto.getImagemUrl());
                    }

                    playlist.setAtualizadoEm(LocalDateTime.now());
                    Playlist playlistAtualizada = playlistRepository.save(playlist);
                    return converterParaPlaylistDto(playlistAtualizada);
                });
    }

    @Transactional
    public boolean deletarPlaylist(Long id) {
        if (playlistRepository.existsById(id)) {
            playlistRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public Optional<PlaylistDto> adicionarLivroNaPlaylist(Long playlistId, Long livroId) {
        Optional<Playlist> playlistOpt = playlistRepository.findByIdWithLivros(playlistId);
        Optional<Livro> livroOpt = livroRepository.findById(livroId);

        if (playlistOpt.isPresent() && livroOpt.isPresent()) {
            Playlist playlist = playlistOpt.get();
            Livro livro = livroOpt.get();

            if (!playlist.getLivros().contains(livro)) {
                playlist.getLivros().add(livro);
                playlist.setQtdeLivros(playlist.getLivros().size());
                playlist.setAtualizadoEm(LocalDateTime.now());
                
                // Lógica de imagem:
                // - Se a playlist tem imagem PADRÃO: sempre usa a capa do último livro adicionado
                // - Se a playlist tem imagem PERSONALIZADA (diferente da padrão): NUNCA altera
                if (playlist.getImagemUrl() == null || 
                    playlist.getImagemUrl().equals(IMAGEM_PADRAO) ||
                    playlist.getImagemUrl().trim().isEmpty()) {
                    
                    // Playlist está com imagem padrão, usa a capa do livro que acabou de adicionar
                    if (livro.getUrlCapa() != null && !livro.getUrlCapa().trim().isEmpty()) {
                        playlist.setImagemUrl(livro.getUrlCapa());
                    }
                }
                // Se a playlist tem imagem personalizada (URL fornecida pelo usuário), preserva

                Playlist playlistAtualizada = playlistRepository.save(playlist);
                return Optional.of(converterParaPlaylistDto(playlistAtualizada));
            } else {
                throw new IllegalArgumentException("Livro já está presente na playlist");
            }
        }
        return Optional.empty();
    }

    @Transactional
    public Optional<PlaylistDto> removerLivroDaPlaylist(Long playlistId, Long livroId) {
        Optional<Playlist> playlistOpt = playlistRepository.findByIdWithLivros(playlistId);
        Optional<Livro> livroOpt = livroRepository.findById(livroId);

        if (playlistOpt.isPresent() && livroOpt.isPresent()) {
            Playlist playlist = playlistOpt.get();
            Livro livro = livroOpt.get();

            if (playlist.getLivros().remove(livro)) {
                playlist.setQtdeLivros(playlist.getLivros().size());
                playlist.setAtualizadoEm(LocalDateTime.now());
                
                // Se a imagem da playlist era a capa deste livro que foi removido,
                // volta para a imagem padrão OU usa a capa do próximo livro
                String imagemAtual = playlist.getImagemUrl();
                String capaLivroRemovido = livro.getUrlCapa();
                
                // Verifica se a imagem atual é a capa do livro que está sendo removido
                if (imagemAtual != null && capaLivroRemovido != null && 
                    imagemAtual.equals(capaLivroRemovido)) {
                    
                    // Se ainda há livros, usa a capa do primeiro
                    if (playlist.getQtdeLivros() > 0 && playlist.getLivros().get(0).getUrlCapa() != null) {
                        playlist.setImagemUrl(playlist.getLivros().get(0).getUrlCapa());
                    } else {
                        // Playlist ficou vazia, volta para a imagem padrão
                        playlist.setImagemUrl(IMAGEM_PADRAO);
                    }
                }
                // Se a imagem era personalizada (não era capa de livro), mantém

                Playlist playlistAtualizada = playlistRepository.save(playlist);
                return Optional.of(converterParaPlaylistDto(playlistAtualizada));
            }
        }
        return Optional.empty();
    }

    private LivroDto converterParaLivroDto(Livro livro) {
        LivroDto dto = new LivroDto();
        dto.setLivroId(livro.getLivroId());
        dto.setTitulo(livro.getTitulo());
        dto.setUrlCapa(livro.getUrlCapa());
        dto.setGenero(livro.getGenero());
        dto.setSubgenero(livro.getSubgenero());
        dto.setSinopse(livro.getSinopse());
        dto.setAnoPublicacao(livro.getAnoPublicacao());
        dto.setNota(livro.getNota());
        dto.setTotalPaginas(livro.getTotalPaginas());
        dto.setUrlPdf(livro.getUrlPdf());
        return dto;
    }

    private UsuarioResumoDto converterUsuarioParaResumo(Usuario usuario) {
        if (usuario == null) return null;

        UsuarioResumoDto usuarioResumo = new UsuarioResumoDto();
        usuarioResumo.setUsuarioId(usuario.getUsuarioId());
        usuarioResumo.setNomeUsuario(usuario.getNomeUsuario());
        usuarioResumo.setEmail(usuario.getEmail());
        usuarioResumo.setFotoPerfilUrl(usuario.getFotoPerfilUrl());

        return usuarioResumo;
    }

    public List<PlaylistDto> listarPlaylistsPorUsuario(Long usuarioId) {
        List<Playlist> playlists = playlistRepository.findByUsuario_UsuarioId(usuarioId);
        return playlists.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<PlaylistDto> buscarPlaylistDoUsuario(Long usuarioId, Long playlistId) {
        Optional<Playlist> playlist = playlistRepository.findByPlaylistIdAndUsuario_UsuarioId(playlistId, usuarioId);
        return playlist.map(this::convertToDto);
    }

    private PlaylistDto convertToDto(Playlist playlist) {
        PlaylistDto dto = new PlaylistDto();
        dto.setPlaylistId(playlist.getPlaylistId());
        dto.setTitulo(playlist.getTitulo());
        dto.setDescricao(playlist.getDescricao());
        dto.setQtdeLivros(playlist.getQtdeLivros());
        dto.setImagemUrl(playlist.getImagemUrl());
        dto.setCriadoEm(playlist.getCriadoEm());
        dto.setAtualizadoEm(playlist.getAtualizadoEm());

        if (playlist.getUsuario() != null) {
            UsuarioResumoDto usuarioResumo = new UsuarioResumoDto();
            usuarioResumo.setUsuarioId(playlist.getUsuario().getId()); 
            usuarioResumo.setNomeUsuario(playlist.getUsuario().getNomeUsuario());
            usuarioResumo.setFotoPerfilUrl(playlist.getUsuario().getFotoPerfilUrl());
            dto.setUsuario(usuarioResumo);
        }

        if (playlist.getLivros() != null) {
            List<LivroDto> livrosDto = playlist.getLivros().stream()
                    .map(this::converterParaLivroDto) 
                    .collect(Collectors.toList());
            dto.setLivros(livrosDto);
        }

        return dto;
    }
}