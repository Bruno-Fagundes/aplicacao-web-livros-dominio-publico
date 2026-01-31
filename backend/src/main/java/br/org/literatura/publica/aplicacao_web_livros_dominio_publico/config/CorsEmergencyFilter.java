package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsEmergencyFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(CorsEmergencyFilter.class);

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String origin = request.getHeader("Origin");
        
        log.info("🌐 CORS Filter - Origin: {}, Method: {}, URI: {}", 
            origin, request.getMethod(), request.getRequestURI());

        // Lista de origens permitidas
        boolean isAllowed = origin != null && (
            origin.equals("http://localhost:4200") ||
            origin.equals("https://literaturapublica.vercel.app") ||
            origin.endsWith(".vercel.app")
        );

        if (isAllowed) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
            response.setHeader("Access-Control-Allow-Headers", 
                "Authorization, Content-Type, Accept, Origin, X-Requested-With, ngrok-skip-browser-warning");
            response.setHeader("Access-Control-Expose-Headers", "Authorization, Content-Disposition");
            response.setHeader("Access-Control-Max-Age", "3600");
            
            log.info("✅ Headers CORS adicionados para: {}", origin);
        } else {
            log.warn("❌ Origem não permitida: {}", origin);
        }

        // Se for OPTIONS, retornar 200 OK e parar aqui
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            log.info("✅ Preflight OPTIONS - retornando 200 OK");
            response.setStatus(HttpServletResponse.SC_OK);
            return; // IMPORTANTE: não continua a cadeia
        }

        chain.doFilter(req, res);
    }

    @Override
    public void init(FilterConfig filterConfig) {}

    @Override
    public void destroy() {}
}
