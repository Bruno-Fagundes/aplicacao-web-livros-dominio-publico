package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

        @Bean
        public ModelMapper modelMapper() {
            return new ModelMapper();
        }
}

