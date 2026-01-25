package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Usuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DebugController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/test-login")
    public Map<String, Object> testLogin(@RequestBody Map<String, String> payload) {
        String nomeUsuarioOuEmail = payload.get("nomeUsuarioOuEmail");
        String senha = payload.get("senha");

        Map<String, Object> result = new HashMap<>();

        try {
            Usuario usuario = usuarioRepository.findByNomeUsuario(nomeUsuarioOuEmail)
                    .orElseGet(() -> usuarioRepository.findByEmail(nomeUsuarioOuEmail).orElse(null));

            if (usuario == null) {
                result.put("erro", "Usuario nao encontrado");
                return result;
            }

            result.put("usuarioId", usuario.getId());
            result.put("nomeUsuario", usuario.getNomeUsuario());
            result.put("email", usuario.getEmail());
            result.put("senhaInformada", senha);
            result.put("senhaNoBanco", usuario.getSenha());
            result.put("senhaNoBancoLength", usuario.getSenha().length());
            result.put("senhaComecarComDolar", usuario.getSenha().startsWith("$"));

            boolean senhaValida = passwordEncoder.matches(senha, usuario.getSenha());
            result.put("senhaValida", senhaValida);

            try {
                result.put("status", usuario.getStatus());
                result.put("funcao", usuario.getFuncao());
                result.put("fotoPerfilUrl", usuario.getFotoPerfilUrl());
                result.put("conversaoDTO", "OK");
            } catch (Exception e) {
                result.put("conversaoDTO", "ERRO: " + e.getMessage());
                result.put("stackTrace", getStackTrace(e));
            }

        } catch (Exception e) {
            result.put("erro", e.getMessage());
            result.put("stackTrace", getStackTrace(e));
        }

        return result;
    }

    private String getStackTrace(Exception e) {
        StringBuilder sb = new StringBuilder();
        for (StackTraceElement element : e.getStackTrace()) {
            sb.append(element.toString()).append("\n");
        }
        return sb.toString();
    }
}