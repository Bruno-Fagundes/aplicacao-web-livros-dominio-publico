package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.exceptions;

public class UsuarioExistenteException extends RuntimeException {
    public UsuarioExistenteException(String msg) {
        super(msg);
    }
}

