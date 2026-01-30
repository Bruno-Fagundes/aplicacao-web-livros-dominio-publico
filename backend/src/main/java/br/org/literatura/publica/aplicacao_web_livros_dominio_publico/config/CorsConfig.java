package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // ✅ URL CORRETA DO SEU FRONTEND
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:4200",
            "http://localhost:*",
            "https://literaturapublica.vercel.app",  // ✅ SUA URL REAL
            "https://*.vercel.app"  // ✅ Para deployments de preview também
        ));
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        config.setAllowedHeaders(List.of("*"));
        
        config.setExposedHeaders(List.of("Authorization", "Content-Disposition"));
        
        // ✅ Permite cookies/credentials
        config.setAllowCredentials(true);
        
        // Cache da resposta preflight (OPTIONS)
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return source;
    }
}
