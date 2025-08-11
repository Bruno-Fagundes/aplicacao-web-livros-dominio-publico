package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.LivroDetalhesDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service.LivroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/livros")
@CrossOrigin(origins = "http://localhost:4200")
public class LivroController {

    @Autowired
    private LivroService livroService;

    @Autowired
    private ResourceLoader resourceLoader;

    @GetMapping("/{id}")
    public ResponseEntity<LivroDetalhesDto> buscarLivroPorId(@PathVariable Long id) {
        Optional<LivroDetalhesDto> livro = livroService.buscarDetalhesLivro(id);

        if (livro.isPresent()) {
            return ResponseEntity.ok(livro.get());
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/pdf/{nomeAutor}/{nomeArquivo}")
    public ResponseEntity<Resource> baixarPdf(@PathVariable String nomeAutor, @PathVariable String nomeArquivo) {
        try {
            String caminhoPdf = "classpath:static/pdfs/livros/" + nomeAutor + "/" + nomeArquivo;
            Resource resource = resourceLoader.getResource(caminhoPdf);

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + nomeArquivo + "\"")
                        .body(resource);
            }

            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}