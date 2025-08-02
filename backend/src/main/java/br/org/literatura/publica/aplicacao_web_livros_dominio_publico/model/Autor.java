package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "autores")
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
