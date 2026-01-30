package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistration() {
        CorsConfiguration config = new CorsConfiguration();
        
        // 🔥 A MUDANÇA MÁGICA ESTÁ AQUI:
        // Use setAllowedOriginPatterns em vez de setAllowedOrigins.
        // Isso permite Credentials=true funcionar com múltiplos domínios (ngrok, vercel, localhost)
        config.setAllowedOriginPatterns(List.of("*")); 
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        
        // Permite todos os headers (Authorization, ngrok-skip, etc)
        config.setAllowedHeaders(List.of("*"));
        
        // Expõe headers importantes para o navegador conseguir ler o nome do arquivo ou erros
        config.setExposedHeaders(List.of("Content-Disposition", "Content-Type", "Content-Length"));
        
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        // Garante que o CORS seja a primeira coisa a ser processada, antes do Spring Security
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
