package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.ProgressoDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service.LeituraUsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/livros")
public class LeituraController {

    private final LeituraUsuarioService leituraService;
    private final Logger log = LoggerFactory.getLogger(LeituraController.class);

    public LeituraController(LeituraUsuarioService leituraService) {
        this.leituraService = leituraService;
    }

    @GetMapping("/{livroId}/progresso")
    public ResponseEntity<ProgressoDto> getProgresso(@PathVariable Long livroId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(null);
        }
        Long usuarioId = extractUserId(authentication);
        if (usuarioId == null) return ResponseEntity.ok(null);
        ProgressoDto dto = leituraService.buscarProgresso(usuarioId, livroId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{livroId}/progresso")
    public ResponseEntity<?> salvarProgresso(@PathVariable Long livroId,
                                             @RequestBody Map<String, Integer> body,
                                             Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Long usuarioId = extractUserId(authentication);
        if (usuarioId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Integer pagina = body.get("paginaAtual");
        try {
            ProgressoDto atualizado = leituraService.salvarProgresso(usuarioId, livroId, pagina);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException ex) {
            log.warn("Erro salvar progresso: {}", ex.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            log.error("Erro interno ao salvar progresso", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication == null) return null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof String) {
            try { return Long.valueOf((String) principal); } catch (Exception ignored) {}
        }
        if (principal instanceof Long) {
            return (Long) principal;
        }
        try {
            var method = principal.getClass().getMethod("getId");
            Object val = method.invoke(principal);
            if (val instanceof Number) return ((Number) val).longValue();
        } catch (Exception ignored) {}
        try {
            var method = principal.getClass().getMethod("getUsuarioId");
            Object val = method.invoke(principal);
            if (val instanceof Number) return ((Number) val).longValue();
        } catch (Exception ignored) {}
        return null;
    }
}
