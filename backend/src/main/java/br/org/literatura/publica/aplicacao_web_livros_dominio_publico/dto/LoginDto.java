package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDto {

    @NotBlank(message = "Nome de usuário ou email é obrigatório")
    private String nomeUsuarioOuEmail;

    @NotBlank(message = "Senha é obrigatória")
    private String senha;

    public String getNomeUsuarioOuEmail() {
        return nomeUsuarioOuEmail;
    }

    public void setNomeUsuarioOuEmail(String nomeUsuarioOuEmail) {
        this.nomeUsuarioOuEmail = nomeUsuarioOuEmail;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}