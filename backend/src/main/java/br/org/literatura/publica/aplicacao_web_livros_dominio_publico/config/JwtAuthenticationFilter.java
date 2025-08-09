package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();

        // **1. IGNORAR ROTAS PÚBLICAS**
        // Permite que requisições para a rota de autenticação prossigam sem validação de token.
        // A sua lógica já estava correta, mas podemos deixar a intenção mais clara.
        if (path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // **2. PROCURAR PELO HEADER DE AUTORIZAÇÃO**
        // A partir daqui, a lógica para validar o JWT deve ser implementada.
        String authorizationHeader = request.getHeader("Authorization");

        // Se o header não existe ou não começa com "Bearer ", continua a cadeia de filtros
        // sem autenticar (o Spring Security vai bloquear com 403 depois).
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // **3. EXTRAIR E VALIDAR O TOKEN**
        String token = authorizationHeader.substring(7); // Remove "Bearer " do início

        // Aqui você chamaria um serviço para validar o token JWT
        // Ex: if (jwtService.isTokenValid(token)) {
        //         // Extrai o nome de usuário e cria a autenticação
        //         UserDetails userDetails = userDetailsService.loadUserByUsername(jwtService.extractUsername(token));
        //         var authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        //         SecurityContextHolder.getContext().setAuthentication(authentication);
        //     }

        // Continua a cadeia de filtros após a lógica de validação
        filterChain.doFilter(request, response);
    }
}