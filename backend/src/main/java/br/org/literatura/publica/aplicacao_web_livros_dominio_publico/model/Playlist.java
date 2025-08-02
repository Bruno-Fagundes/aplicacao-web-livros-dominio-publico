package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "playlists")
public class Playlist {
    
    private long id;
    private long UsusarioId;
    private String titulo;
    private String descricao;
    private int quant_livros;
    private String imagem_url;
    private LocalDateTime criado_em;
    private LocalDateTime atualizado_em;
}


