package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.CadastroDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.LoginDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.UsuarioDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
public class AuthController {

    private final AuthService auth;

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody CadastroDto dto) {
        try {
            auth.cadastrar(dto);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IllegalArgumentException e) {
            // Erros de validação simples (ex: senhas diferentes)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            // Serviço lança RuntimeException para conflitos (nome/email já usado)
            String msg = e.getMessage() != null ? e.getMessage() : "Erro ao cadastrar";

            String lower = msg.toLowerCase();

            // Tenta identificar se é problema com email ou com nome de usuário
            if (lower.contains("email") || lower.contains("e-mail")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("field", "email", "message", msg));
            }

            if (lower.contains("nome de usuário") || lower.contains("nomeusuario")
                    || lower.contains("usuário") || lower.contains("usuario")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("field", "nomeUsuario", "message", msg));
            }

            // fallback: erro genérico do servidor
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", msg));
        }
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @Valid @RequestBody LoginDto dto) {
        UsuarioDto usuario = auth.login(dto);

        String token = "Validado";

        Map<String, Object> response = Map.of(
                "token", token,
                "usuario", usuario);

        return ResponseEntity.ok(response);
    }
}
