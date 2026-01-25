package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.UsuarioDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Usuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public List<UsuarioDto> listarTodosOsUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(this::converterParaUsuarioDto)
                .collect(Collectors.toList());
    }

    public Optional<UsuarioDto> buscarDetalhesUsuario(Long id) {
        return usuarioRepository.findById(id)
                .map(this::converterParaUsuarioDto);
    }

    private UsuarioDto converterParaUsuarioDto(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        UsuarioDto dto = new UsuarioDto();
        dto.setId(usuario.getId());
        dto.setNomeUsuario(usuario.getNomeUsuario());
        dto.setSenha(usuario.getSenha());
        dto.setEmail(usuario.getEmail());
        dto.setStatus(usuario.getStatus());
        dto.setFuncao(usuario.getFuncao().toString());
        dto.setFotoPerfilUrl(usuario.getFotoPerfilUrl());
        dto.setCriadoEm(usuario.getCriadoEm());
        dto.setAtualizadoEm(usuario.getAtualizadoEm());
        dto.setUltimoAcesso(usuario.getUltimoAcesso());

        return dto;
    }
}