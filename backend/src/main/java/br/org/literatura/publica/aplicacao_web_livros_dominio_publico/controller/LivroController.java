package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.LivroDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.LivroRepository;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service.LivroService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
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

@RestController
@RequestMapping("/api/livros")
// ❌ REMOVIDO @CrossOrigin - deixa o CorsConfig cuidar disso
@RequiredArgsConstructor
public class LivroController {

    private static final Logger log = LoggerFactory.getLogger(LivroController.class);
    
    private LivroRepository livroRepository;

    @Autowired
    private LivroService livroService;

    @GetMapping("/{id}")
    public ResponseEntity<LivroDto> buscarLivroPorId(@PathVariable Long id) {
        log.info("📖 Buscando livro ID: {}", id);
        Optional<LivroDto> livro = livroService.buscarDetalhesLivro(id);

        if (livro.isPresent()) {
            return ResponseEntity.ok(livro.get());
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/pdf/{nomeAutor}/{nomeArquivo:.+}")
    public ResponseEntity<Resource> baixarPdf(
            @PathVariable String nomeAutor, 
            @PathVariable String nomeArquivo) {
        
        log.info("📄 Requisição de PDF: {}/{}", nomeAutor, nomeArquivo);
        
        try {
            java.nio.file.Path path = java.nio.file.Paths
                .get("/app/pdfs/livros/", nomeAutor, nomeArquivo)
                .normalize();
            
            log.debug("📁 Caminho do PDF: {}", path.toAbsolutePath());
            
            Resource resource = new org.springframework.core.io.FileSystemResource(path.toFile());

            if (!resource.exists()) {
                log.error("❌ PDF não encontrado: {}", path);
                return ResponseEntity.notFound().build();
            }

            if (!resource.isReadable()) {
                log.error("❌ PDF não pode ser lido: {}", path);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            log.info("✅ PDF encontrado. Tamanho: {} bytes", resource.contentLength());

            // ✅ IMPORTANTE: NÃO adicionar Access-Control-Allow-Origin aqui!
            // O CorsConfig já cuida de tudo
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(resource.contentLength())
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + nomeArquivo + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    // ❌ REMOVIDO: .header(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*")
                    .body(resource);

        } catch (Exception e) {
            log.error("❌ Erro ao servir PDF: {}/{}", nomeAutor, nomeArquivo, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("")
    public List<LivroDto> listar() {
        log.info("📚 Listando todos os livros");
        return livroService.listarTodosOsLivros();
    }

    @GetMapping("/pagina")
    public ResponseEntity<Page<LivroDto>> listarPaginado(
            @PageableDefault(page = 0, size = 4) Pageable pageable
    ) {
        log.info("📄 Listando livros paginados: página {}, tamanho {}", 
            pageable.getPageNumber(), pageable.getPageSize());
        Page<LivroDto> pagina = livroService.listarPaginado(pageable);
        return ResponseEntity.ok(pagina);
    }

    @GetMapping("/generos")
    public ResponseEntity<List<String>> listarGeneros() {
        List<String> generos = livroService.listarGeneros();
        log.info("🎭 Listando {} gêneros", generos.size());
        return ResponseEntity.ok(generos);
    }

    @GetMapping("/subgeneros")
    public ResponseEntity<List<String>> listarSubgeneros(@RequestParam(required = false) String genero) {
        List<String> sub = livroService.listarSubgenerosPorGenero(genero);
        log.info("📑 Listando subgêneros para: {}", genero);
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
        log.info("🔍 Filtrando livros - gênero:{}, subgênero:{}, ordem:{}", genero, subgenero, ordenar);
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
