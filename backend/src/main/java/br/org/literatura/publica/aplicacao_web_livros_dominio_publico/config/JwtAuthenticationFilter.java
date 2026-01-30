package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.config;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.security.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.util.AntPathMatcher;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtils jwtUtils;
    private final AntPathMatcher matcher = new AntPathMatcher();

    private final List<String> publicPatterns = List.of(
        "/auth/**",
        "/debug/**",
        "/public/**",
        "/assets/**",
        "/static/**",
        "/autores/**",
        "/playlists/**",
        "/livros/pdf/**",
        "/api/livros/pdf/**",
        "/api/livros/pdfs/**",
        "/livros",
        "/livros/*/detalhes"
    );

    public JwtAuthenticationFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();
        String method = request.getMethod();
        String authHeader = request.getHeader("Authorization");

        // 1) short-circuit para preflight OPTIONS
        if ("OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        log.debug("[JwtFilter] {} {}", method, path);

        // 2) caminhos públicos
        if (isPublicPath(path)) {
            log.debug("[JwtFilter] Caminho público: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        // 3) sem header -> passa adiante (rota pode recusar depois se necessário)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("[JwtFilter] Sem Bearer token");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7);
            // não logar token nem seu tamanho em produção; mantendo log mínimo
            log.debug("[JwtFilter] Token recebido - validando...");

            if (!jwtUtils.validateToken(token)) {
                log.warn("[JwtFilter] Token inválido ou expirado");
                filterChain.doFilter(request, response);
                return;
            }

            Long userId = jwtUtils.getUserIdFromToken(token);
            log.info("[JwtFilter] Autenticado userId={}", userId);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            log.error("[JwtFilter] Erro ao processar token", e);
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicPath(String path) {
        // usa Ant matcher para suportar wildcard mais fácil
        for (String pattern : publicPatterns) {
            if (matcher.match(pattern, path)) return true;
        }
        // fallback para números simples: /livros/{id}
        if (path.matches("/livros/\\d+$")) return true;
        return false;
    }
}
