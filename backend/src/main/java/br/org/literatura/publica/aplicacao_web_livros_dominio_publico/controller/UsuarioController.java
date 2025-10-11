package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.UsuarioDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
public class UsuarioController {

    private static final Logger log = LoggerFactory.getLogger(UsuarioController.class);

    private final UsuarioService usuarioService;

    @GetMapping("")
    public ResponseEntity<List<UsuarioDto>> listar() {
        log.debug("Listando todos os usuários");
        List<UsuarioDto> usuarios = usuarioService.listarTodosOsUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarUsuarioPorId(@PathVariable Long id) {
        log.debug("=== BUSCAR USUARIO POR ID ===");
        log.debug("ID solicitado: {}", id);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.debug("Authentication: {}", auth);
        log.debug("isAuthenticated: {}", auth != null ? auth.isAuthenticated() : "null");
        log.debug("Principal: {}", auth != null ? auth.getPrincipal() : "null");

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            log.warn("Acesso negado - usuário não autenticado tentando acessar ID: {}", id);
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Você precisa estar autenticado para acessar esta página"));
        }

        Long authUserId = extractUserIdFromAuth(auth);
        log.debug("ID extraído da autenticação: {}", authUserId);

        if (authUserId == null) {
            log.error("Não foi possível extrair ID do usuário autenticado");
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Token de autenticação inválido"));
        }

        log.debug("Usuário autenticado ID: {}, tentando acessar ID: {}", authUserId, id);

        if (!authUserId.equals(id)) {
            log.warn("Acesso negado - usuário {} tentou acessar dados do usuário {}", authUserId, id);
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Você não tem permissão para acessar os dados de outro usuário"));
        }

        Optional<UsuarioDto> usuario = usuarioService.buscarDetalhesUsuario(id);

        if (usuario.isEmpty()) {
            log.warn("Usuário não encontrado: ID {}", id);
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Usuário não encontrado"));
        }

        log.info("Acesso autorizado aos dados do usuário ID: {}", id);
        return ResponseEntity.ok(usuario.get());
    }

    private Long extractUserIdFromAuth(Authentication auth) {
        Object principal = auth.getPrincipal();

        if (principal instanceof Long) {
            return (Long) principal;
        }

        if (principal instanceof String) {
            try {
                return Long.valueOf((String) principal);
            } catch (NumberFormatException e) {
                log.error("Erro ao converter principal para Long: {}", principal);
                return null;
            }
        }

        log.error("Tipo de principal não suportado: {}", principal.getClass().getName());
        return null;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(
            @PathVariable Long id,
            @RequestBody UsuarioDto dto) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long authUserId = extractUserIdFromAuth(auth);

        if (authUserId == null || !authUserId.equals(id)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Você não tem permissão para atualizar este usuário"));
        }

        return ResponseEntity
                .status(HttpStatus.NOT_IMPLEMENTED)
                .body(Map.of("message", "Funcionalidade em desenvolvimento"));
    }
}