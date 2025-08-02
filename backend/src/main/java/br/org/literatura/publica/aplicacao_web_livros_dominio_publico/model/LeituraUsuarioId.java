package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeituraUsuarioId implements Serializable {
    private Long usuarioId;
    private Long livroId;
}
