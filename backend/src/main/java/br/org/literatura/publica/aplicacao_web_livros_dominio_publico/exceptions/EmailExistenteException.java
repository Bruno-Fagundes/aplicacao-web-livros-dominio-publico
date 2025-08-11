package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.exceptions;

public class EmailExistenteException extends RuntimeException {
    public EmailExistenteException(String message) {
        super(message);
    }
}
