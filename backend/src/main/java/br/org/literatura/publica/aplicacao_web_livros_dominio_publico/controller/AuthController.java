package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.CadastroDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.LoginDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.UsuarioDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService auth;

    @PostMapping("/cadastrar")
    public ResponseEntity<Void> cadastrar(
            @Valid @RequestBody CadastroDto dto
    ) {
        auth.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioDto> login(
            @Valid @RequestBody LoginDto dto
    ) {
        UsuarioDto user = auth.login(dto);
        return ResponseEntity.ok(user);
    }
}
