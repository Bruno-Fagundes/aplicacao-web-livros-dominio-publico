package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) // Usa o CorsConfigurationSource automaticamente
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // ✅ Rotas públicas
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                
                // ✅ IMPORTANTE: PDFs devem ser públicos
                .requestMatchers("/api/livros/pdf/**").permitAll()
                .requestMatchers("/livros/pdf/**").permitAll()
                .requestMatchers("/pdfs/**").permitAll()
                
                // ✅ Rotas públicas de livros
                .requestMatchers("/api/livros").permitAll()
                .requestMatchers("/api/livros/*").permitAll()
                .requestMatchers("/api/livros/pagina").permitAll()
                .requestMatchers("/api/livros/filtrar").permitAll()
                .requestMatchers("/api/livros/generos").permitAll()
                .requestMatchers("/api/livros/subgeneros").permitAll()
                
                // ✅ Debug (remover em produção)
                .requestMatchers("/debug/**").permitAll()
                
                // ✅ Rotas de autores e playlists públicas
                .requestMatchers("/api/autores/**").permitAll()
                .requestMatchers("/api/playlists/publicas").permitAll()
                
                // ✅ Assets estáticos
                .requestMatchers("/assets/**").permitAll()
                .requestMatchers("/static/**").permitAll()
                
                // ✅ Outras rotas requerem autenticação
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
}
