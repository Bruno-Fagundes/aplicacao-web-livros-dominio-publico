// src/main/java/br/org/literatura/publica/aplicacao_web_livros_dominio_publico/service/AutorService.java
package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.AutorDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.LivroDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Autor;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Livro;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.AutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AutorService {

    private final AutorRepository autorRepository;

    public List<AutorDto> listarTodosOsAutores() {
        List<Autor> autores = autorRepository.findAll();
        return autores.stream()
                .map(this::converterParaAutorDto)
                .collect(Collectors.toList());
    }

    public Optional<AutorDto> buscarDetalhesAutor(Long id) {
        return autorRepository.findByIdWithLivros(id)
                .map(this::converterParaAutorDto);
    }

    // Método auxiliar para converter a entidade Autor em um AutorDto
    private AutorDto converterParaAutorDto(Autor autor) {
        if (autor == null) {
            return null;
        }

        AutorDto dto = new AutorDto();
        dto.setAutorId(autor.getAutorId());
        dto.setNome(autor.getNome());
        dto.setBiografia(autor.getBiografia());
        dto.setDataNascimento(autor.getDataNascimento());
        dto.setDataFalecimento(autor.getDataFalecimento());
        dto.setUrlFoto(autor.getUrlFoto());

        // Mapeia a lista de livros do autor para LivroDto
        // Adiciona uma verificação para garantir que a lista de livros não seja nula
        List<LivroDto> livrosDto = autor.getLivros() != null ? autor.getLivros().stream()
                .map(this::converterParaLivroDto)
                .collect(Collectors.toList()) : Collections.emptyList(); // Retorna uma lista vazia se for nulo

        dto.setLivros(livrosDto);

        return dto;
    }

    /**
     * Método auxiliar para converter uma entidade Livro em um LivroDto completo.
     * Esta conversão preenche todos os campos do DTO.
     * 
     * @param livro A entidade Livro.
     * @return O LivroDto correspondente.
     */
    private LivroDto converterParaLivroDto(Livro livro) {
        LivroDto dto = new LivroDto();
        dto.setLivroId(livro.getLivroId());
        dto.setTitulo(livro.getTitulo());
        dto.setUrlCapa(livro.getUrlCapa());
        dto.setGenero(livro.getGenero());
        dto.setSubgenero(livro.getSubgenero());
        dto.setSinopse(livro.getSinopse());
        dto.setAnoPublicacao(livro.getAnoPublicacao());
        dto.setNota(livro.getNota());
        dto.setTotalPaginas(livro.getTotalPaginas());
        dto.setUrlPdf(livro.getUrlPdf());

        // Note que o autor não é setado aqui para evitar uma referência circular
        return dto;
    }
}
