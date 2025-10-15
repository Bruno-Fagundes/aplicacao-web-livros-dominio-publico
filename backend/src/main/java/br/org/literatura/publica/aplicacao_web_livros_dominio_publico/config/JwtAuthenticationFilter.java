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

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtils jwtUtils;

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

        log.debug("========================================");
        log.debug("[JwtFilter] Method: {}", method);
        log.debug("[JwtFilter] Path: {}", path);
        log.debug("[JwtFilter] Authorization: {}", authHeader != null ? "Bearer ***" : "null");
        log.debug("========================================");

        if (isPublicPath(path)) {
            log.debug("[JwtFilter] Caminho público detectado - passando sem validação");
            filterChain.doFilter(request, response);
            return;
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("[JwtFilter] Sem Bearer token - passando");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7);
            log.debug("[JwtFilter] Token recebido (length={})", token.length());

            if (!jwtUtils.validateToken(token)) {
                log.warn("[JwtFilter] Token inválido ou expirado");
                filterChain.doFilter(request, response);
                return;
            }

            Long userId = jwtUtils.getUserIdFromToken(token);
            log.info("[JwtFilter] Token válido para userId={}", userId);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            log.debug("[JwtFilter] Autenticação definida no SecurityContext");

        } catch (Exception e) {
            log.error("[JwtFilter] Erro ao processar token: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicPath(String path) {
        return path.startsWith("/auth/") ||
            path.equals("/auth") ||
            path.startsWith("/debug/") ||
            path.startsWith("/public/") ||
            path.startsWith("/assets/") ||
            path.startsWith("/static/") ||
            path.startsWith("/autores/") ||
            path.startsWith("/playlists/") ||
            path.startsWith("/livros/pdf/") || 
            path.startsWith("/api/livros/pdf/") ||
            path.matches("/livros/\\d+$") ||        
            path.equals("/livros") ||                 
            path.matches("/livros/\\d+/detalhes$");    
        
    }
}