package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.AutorDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service.AutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/autores")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AutorController {

    private final AutorService autorService;

    @GetMapping("")
    public List<AutorDto> listarTodosOsAutores() {
        return autorService.listarTodosOsAutores();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AutorDto> buscarAutorPorId(@PathVariable Long id) {
        Optional<AutorDto> autor = autorService.buscarDetalhesAutor(id);

        return autor.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/pagina")
    public ResponseEntity<?> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(autorService.listarPaginado(page, size));
    }

}
