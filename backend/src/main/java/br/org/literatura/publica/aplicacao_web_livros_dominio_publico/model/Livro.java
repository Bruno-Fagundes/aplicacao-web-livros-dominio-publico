package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Livro {

    private long id;
    private long autorId;

    private String titulo;
    private String genero;
    private String subgenero;
    private String sinopse;

    private int anoPublicacao;
    public float nota;
    private int totalPaginas;

    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

}
