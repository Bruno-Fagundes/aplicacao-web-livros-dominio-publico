package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "estatisticas_livros")
public class EstatisticasLivros {

    @Id
    @Column(name = "livro_id")
    private Long livroId;

    @Column(name = "total_leitura")
    private Integer totalLeitura;

    // aqui armazenamos a média das notas
    @Column(name = "total_avaliacao")
    private Double totalAvaliacao;

    @Column(name = "qtde_avaliacao")
    private Long qtdeAvaliacao;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    public Long getLivroId() { return livroId; }
    public void setLivroId(Long livroId) { this.livroId = livroId; }

    public Integer getTotalLeitura() { return totalLeitura; }
    public void setTotalLeitura(Integer totalLeitura) { this.totalLeitura = totalLeitura; }

    public Double getTotalAvaliacao() { return totalAvaliacao; }
    public void setTotalAvaliacao(Double totalAvaliacao) { this.totalAvaliacao = totalAvaliacao; }

    public Long getQtdeAvaliacao() { return qtdeAvaliacao; }
    public void setQtdeAvaliacao(Long qtdeAvaliacao) { this.qtdeAvaliacao = qtdeAvaliacao; }

    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}
