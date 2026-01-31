package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // ✅ Rotas de autenticação
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                
                // ✅ PDFs públicos
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
                
                // ✅ ESTATÍSTICAS PÚBLICAS
                .requestMatchers("/api/livros/*/classificacao/estatisticas").permitAll()
                
                // ✅ Autores públicos
                .requestMatchers("/api/autores/**").permitAll()
                .requestMatchers("/api/playlists/publicas").permitAll()
                
                // ✅ Assets
                .requestMatchers("/assets/**").permitAll()
                .requestMatchers("/static/**").permitAll()
                .requestMatchers("/debug/**").permitAll()
                
                // ✅ Rotas que REQUEREM autenticação
                .requestMatchers("/api/livros/*/classificacao/usuario/*").authenticated()
                .requestMatchers("/api/livros/*/progresso").authenticated()
                .requestMatchers("/api/usuarios/**").authenticated()
                
                // Outras rotas
                .anyRequest().authenticated()
            )
            // ✅ ADICIONAR O JWT FILTER AQUI!
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
