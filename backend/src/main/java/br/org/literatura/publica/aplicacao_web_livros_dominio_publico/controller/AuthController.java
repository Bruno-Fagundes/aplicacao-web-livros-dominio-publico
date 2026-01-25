package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.CadastroDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.LoginDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.UsuarioDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.security.JwtUtils;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService auth;
    private final JwtUtils jwtUtils;

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody CadastroDto dto) {
        try {
            log.debug("Tentativa de cadastro: {}", dto.getNomeUsuario());
            auth.cadastrar(dto);
            log.info("Cadastro realizado com sucesso: {}", dto.getNomeUsuario());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Usuário cadastrado com sucesso"));
        } catch (IllegalArgumentException e) {
            log.warn("Erro de validação no cadastro: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            log.error("Erro ao cadastrar usuário: {}", e.getMessage());
            String msg = e.getMessage() != null ? e.getMessage() : "Erro ao cadastrar";
            String lower = msg.toLowerCase();

            if (lower.contains("email") || lower.contains("e-mail")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("field", "email", "message", msg));
            }

            if (lower.contains("nome de usuário") || lower.contains("nomeusuario")
                    || lower.contains("usuário") || lower.contains("usuario")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("field", "nomeUsuario", "message", msg));
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", msg));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto dto) {
        log.debug("=== INICIO LOGIN ===");
        log.debug("Usuario/Email: {}", dto.getNomeUsuarioOuEmail());

        try {
            log.debug("Chamando auth.login()...");
            UsuarioDto usuario = auth.login(dto);
            log.debug("Usuario autenticado: {} (ID: {})", usuario.getNomeUsuario(), usuario.getId());

            log.debug("Gerando token JWT...");
            String token = jwtUtils.generateToken(usuario.getId());
            log.debug("Token gerado: {}", token.substring(0, 20) + "...");

            log.debug("Montando resposta JSON...");
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("token", token);
            response.put("usuario", usuario);

            log.info("=== LOGIN SUCESSO: {} ===", usuario.getNomeUsuario());
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("=== ERRO RUNTIME NO LOGIN ===");
            log.error("Tipo: {}", e.getClass().getName());
            log.error("Mensagem: {}", e.getMessage());
            log.error("StackTrace: ", e);

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message", e.getMessage() != null ? e.getMessage() : "Erro ao fazer login",
                            "error", "Unauthorized"
                    ));
        } catch (Exception e) {
            log.error("=== ERRO INESPERADO NO LOGIN ===");
            log.error("Tipo: {}", e.getClass().getName());
            log.error("Mensagem: {}", e.getMessage());
            log.error("StackTrace: ", e);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Erro interno: " + e.getMessage(),
                            "error", "Internal Server Error",
                            "type", e.getClass().getSimpleName()
                    ));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Token não fornecido"));
            }

            String token = authHeader.substring(7);

            if (!jwtUtils.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Token inválido ou expirado"));
            }

            Long userId = jwtUtils.getUserIdFromToken(token);

            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "userId", userId
            ));

        } catch (Exception e) {
            log.error("Erro ao validar token: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Erro ao validar token"));
        }
    }
}