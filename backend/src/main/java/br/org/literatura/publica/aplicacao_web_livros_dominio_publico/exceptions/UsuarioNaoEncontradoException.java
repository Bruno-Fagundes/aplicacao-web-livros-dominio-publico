package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.exceptions;

public class UsuarioNaoEncontradoException  extends RuntimeException{

    public UsuarioNaoEncontradoException(String message) {
        super(message);
    }
}
