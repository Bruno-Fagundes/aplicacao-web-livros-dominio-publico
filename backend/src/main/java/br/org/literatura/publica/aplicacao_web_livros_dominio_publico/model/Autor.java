package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity(name = "Autor")
public class Autor {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String nome;
    private String biografia;
    private LocalDate dataNascimento;
    private LocalDate dataFalecimento;
    private String url_foto;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}
