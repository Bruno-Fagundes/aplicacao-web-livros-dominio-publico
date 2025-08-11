// src/main/java/br/org/literatura/publica/aplicacao_web_livros_dominio_publico/config/SecurityConfig.java

package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Injeta o filtro JWT. A anotação @Component no filtro garante que o Spring o
    // encontre.
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Configuração de CORS: Permite requisições do seu frontend Angular
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Desabilita CSRF: Essencial para APIs RESTful que usam tokens (JWT)
                .csrf(csrf -> csrf.disable())

                // 3. Configura a gerência de sessão para ser stateless (sem estado)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Define as regras de autorização para os endpoints
                .authorizeHttpRequests(authorize -> authorize
                        // Permite requisições preflight OPTIONS para todos os endpoints
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Permite acesso público a todos os endpoints GET de livros
                        .requestMatchers(HttpMethod.GET, "/api/livros/**").permitAll()

                        // Permite acesso público aos endpoints de autenticação (login, cadastro)
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/autores/**").permitAll()
                        // Permite acesso público aos endpoints de usuários (se houver)
                        .requestMatchers("/api/usuarios/**").permitAll()

                        // Permite acesso a recursos estáticos (se usados)
                        .requestMatchers("/assets/**", "/static/**", "/api/livros/pdf/**").permitAll()

                        // Todas as outras requisições requerem autenticação
                        .anyRequest().authenticated())

                // 5. Adiciona o filtro JWT antes do filtro padrão de autenticação
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // Constrói e retorna a cadeia de filtros de segurança
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite requisições da sua aplicação Angular rodando em localhost:4200
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        // Define os métodos HTTP permitidos
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Define os cabeçalhos permitidos, incluindo o de Autorização para o JWT
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin"));
        // O allowCredentials é 'false' para JWT, pois não usamos cookies/sessão
        configuration.setAllowCredentials(false);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta configuração de CORS a todos os caminhos (/**)
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}