package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.controller;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.ClassificacaoRequestDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.EstatisticasLivroDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.EstatisticasLivros;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.EstatisticasLivrosRepository;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service.ClassificacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/livros/{livroId}/classificacao")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class ClassificacaoController {

    private final ClassificacaoService classificacaoService;
    private final EstatisticasLivrosRepository estatRepo;

    @PostMapping
    public ResponseEntity<?> avaliar(@PathVariable Long livroId,
                                     @RequestBody ClassificacaoRequestDto dto) {
        try {
            classificacaoService.avaliarLivro(livroId, dto);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erro interno: " + ex.getMessage());
        }
    }

    @GetMapping("/estatisticas")
    public ResponseEntity<EstatisticasLivroDto> buscarEstatisticas(@PathVariable Long livroId) {
        EstatisticasLivros e = estatRepo.findByLivroId(livroId).orElse(null);
        if (e == null) {
            // sem avaliações: retornar média 0 e qtde 0
            return ResponseEntity.ok(new EstatisticasLivroDto(livroId, 0.0, 0L));
        }
        return ResponseEntity.ok(new EstatisticasLivroDto(livroId, e.getTotalAvaliacao(), e.getQtdeAvaliacao()));
    }
}
