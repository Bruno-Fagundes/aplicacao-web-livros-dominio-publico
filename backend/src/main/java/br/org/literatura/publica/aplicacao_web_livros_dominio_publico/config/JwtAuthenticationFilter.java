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
    
    // ✅ Caminhos que NÃO precisam de autenticação
    private final List<String> publicPatterns = List.of(
        "/auth/**",
        "/api/auth/**",
        "/debug/**",
        "/public/**",
        "/assets/**",
        "/static/**",
        "/api/autores/**",
        "/api/playlists/publicas",
        
        // ✅ ROTAS DE PDF - MUITO IMPORTANTE!
        "/api/livros/pdf/**",
        "/livros/pdf/**",
        "/pdfs/**",
        
        // ✅ Rotas públicas de livros
        "/api/livros",
        "/api/livros/pagina",
        "/api/livros/filtrar",
        "/api/livros/generos",
        "/api/livros/subgeneros",
        "/api/livros/*/detalhes"
    );
    
    public JwtAuthenticationFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI(); // ✅ Usar getRequestURI() ao invés de getServletPath()
        String method = request.getMethod();
        
        log.debug("[JwtFilter] {} {}", method, path);
        
        // 1) Preflight OPTIONS - sempre permitir
        if ("OPTIONS".equalsIgnoreCase(method)) {
            log.debug("[JwtFilter] OPTIONS request - permitindo");
            filterChain.doFilter(request, response);
            return;
        }
        
        // 2) Verificar se é caminho público
        if (isPublicPath(path)) {
            log.debug("[JwtFilter] Caminho público: {}", path);
            filterChain.doFilter(request, response);
            return;
        }
        
        // 3) Verificar se é GET em /api/livros/{id} (público)
        if ("GET".equalsIgnoreCase(method) && path.matches("/api/livros/\\d+")) {
            log.debug("[JwtFilter] GET público para livro específico: {}", path);
            filterChain.doFilter(request, response);
            return;
        }
        
        // 4) Verificar header Authorization
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("[JwtFilter] Sem token Bearer - continuando sem autenticação");
            filterChain.doFilter(request, response);
            return;
        }
        
        // 5) Validar token JWT
        try {
            String token = authHeader.substring(7);
            log.debug("[JwtFilter] Validando token JWT...");
            
            if (!jwtUtils.validateToken(token)) {
                log.warn("[JwtFilter] Token inválido ou expirado");
                filterChain.doFilter(request, response);
                return;
            }
            
            Long userId = jwtUtils.getUserIdFromToken(token);
            log.info("[JwtFilter] ✅ Autenticado userId={}", userId);
            
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
        } catch (Exception e) {
            log.error("[JwtFilter] ❌ Erro ao processar token:", e);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private boolean isPublicPath(String path) {
        for (String pattern : publicPatterns) {
            if (matcher.match(pattern, path)) {
                log.debug("[JwtFilter] Match público: {} -> {}", path, pattern);
                return true;
            }
        }
        return false;
    }
}
