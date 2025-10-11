package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.LivroDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Livro;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.LivroRepository;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service.LivroService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/livros")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class LivroController {

    private  LivroRepository livroRepository;

    @Autowired
    private LivroService livroService;

    @Autowired
    private ResourceLoader resourceLoader;

    @GetMapping("/{id}")
    public ResponseEntity<LivroDto> buscarLivroPorId(@PathVariable Long id) {
        Optional<LivroDto> livro = livroService.buscarDetalhesLivro(id);

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

    @GetMapping("")
    public List<LivroDto> listar() {
        return livroService.listarTodosOsLivros();
    }

    @GetMapping("/pagina")
    public ResponseEntity<Page<LivroDto>> listarPaginado(
            @PageableDefault(page = 0, size = 4) Pageable pageable
    ) {
        Page<LivroDto> pagina = livroService.listarPaginado(pageable);
        return ResponseEntity.ok(pagina);
    }

    @GetMapping("/generos")
    public ResponseEntity<List<String>> listarGeneros() {
        List<String> generos = livroService.listarGeneros();
        return ResponseEntity.ok(generos);
    }

    @GetMapping("/subgeneros")
    public ResponseEntity<List<String>> listarSubgeneros(@RequestParam(required = false) String genero) {
        List<String> sub = livroService.listarSubgenerosPorGenero(genero);
        return ResponseEntity.ok(sub);
    }

    @GetMapping("/filtrar")
    public ResponseEntity<Page<LivroDto>> filtrar(
            @RequestParam(required = false) String genero,
            @RequestParam(required = false) String subgenero,
            @RequestParam(required = false) String ordenar, 
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Sort sort = mapOrdenarParaSort(ordenar);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<LivroDto> resultado = livroService.filtrar(genero, subgenero, pageable, ordenar);
        return ResponseEntity.ok(resultado);
    }

    private Sort mapOrdenarParaSort(String ordenar) {
        if (ordenar == null) return Sort.by("titulo").ascending(); 
        return switch (ordenar) {
            case "paginasAsc" -> Sort.by("totalPaginas").ascending();
            case "paginasDesc" -> Sort.by("totalPaginas").descending();
            case "tituloAsc" -> Sort.by("titulo").ascending();
            case "tituloDesc" -> Sort.by("titulo").descending();
            case "anoAsc" -> Sort.by("anoPublicacao").ascending();
            case "anoDesc" -> Sort.by("anoPublicacao").descending();
            case "notaAsc" -> Sort.by("nota").ascending(); 
            case "notaDesc" -> Sort.by("nota").descending();
            default -> Sort.by("titulo").ascending();
        };
    }
}