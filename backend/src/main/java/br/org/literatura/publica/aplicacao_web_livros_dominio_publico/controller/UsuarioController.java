package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.CadastroDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.UsuarioDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Usuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.UsuarioRepository;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.FuncaoUsuario.USER;
import static br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.StatusUsuario.ativo;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    private final UsuarioService usuarioService;

    @GetMapping("")
    public List<UsuarioDto> listar() {
        return usuarioService.listarTodosOsUsuarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDto> buscarUsuarioPorId(@PathVariable Long id) {
        Optional<UsuarioDto> usuario = usuarioService.buscarDetalhesUsuario(id);

        return usuario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}