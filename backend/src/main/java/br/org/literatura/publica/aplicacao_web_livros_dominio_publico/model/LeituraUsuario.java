package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "leitura_usuario")
public class LeituraUsuario {

    @EmbeddedId
    private LeituraUsuario id;
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("usuarioId")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("livroId")
    private Livro livro;

    private Integer paginaAtual;
    private Double porcentagemLida;
    private LocalDateTime ultimaLeitura;
}
