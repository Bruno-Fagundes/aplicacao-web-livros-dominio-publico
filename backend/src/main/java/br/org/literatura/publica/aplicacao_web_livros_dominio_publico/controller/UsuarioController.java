package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.CadastroDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.UsuarioDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Usuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.FuncaoUsuario.USER;
import static br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.StatusUsuario.ativo;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    @GetMapping("/usuarios")
    public List<UsuarioDto> listar() {
        List<Usuario> usuarios = usuarioRepository.findAll();

        return usuarios.stream()
                .map(u -> {
                    UsuarioDto dto = new UsuarioDto();
                    dto.setId(u.getId());
                    dto.setNomeUsuario(u.getNomeUsuario());
                    dto.setSenha(u.getSenha());
                    dto.setEmail(u.getEmail());
                    dto.setStatus(u.getStatus());
                    dto.setFuncao(u.getFuncao().toString());
                    dto.setFotoPerfilUrl(u.getFotoPerfilUrl());
                    dto.setCriadoEm(u.getCriadoEm());
                    dto.setAtualizadoEm(u.getAtualizadoEm());
                    dto.setUltimoAcesso(u.getUltimoAcesso());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
