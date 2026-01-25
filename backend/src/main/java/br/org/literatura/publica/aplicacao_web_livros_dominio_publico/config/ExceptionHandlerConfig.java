package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.config;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.exceptions.UsuarioNaoEncontradoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionHandlerConfig {

    @ExceptionHandler(UsuarioNaoEncontradoException.class)
    public ResponseEntity<String> handleUsuarioNaoEncontrado(UsuarioNaoEncontradoException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}

