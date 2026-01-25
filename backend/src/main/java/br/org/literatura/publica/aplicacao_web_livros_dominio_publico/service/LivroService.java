package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.AutorDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.LivroDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Livro;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.ClassificacaoLivrosRepository;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.*;
import jakarta.persistence.criteria.Predicate;
import java.util.stream.Collectors;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;

    @Autowired
    private ClassificacaoLivrosRepository classificacaoLivrosRepository;

    public Optional<LivroDto> buscarDetalhesLivro(Long id) {
        Optional<Livro> livroOptional = livroRepository.findByIdWithAutor(id);

        if (livroOptional.isPresent()) {
            Livro livro = livroOptional.get();

            Double avg = classificacaoLivrosRepository.findAverageNotaByLivroId(id);
            float notaMedia = avg == null ? 0f : avg.floatValue();

            String urlCapa = gerarUrlCapa(livro);
            String urlPdf = gerarUrlPdf(livro);

            AutorDto autorDto = new AutorDto(livro.getAutor().getAutorId(), livro.getAutor().getNome());

            LivroDto dto = new LivroDto(
                    livro.getLivroId(),
                    livro.getTitulo(),
                    autorDto,
                    livro.getGenero(),
                    livro.getSubgenero(),
                    livro.getSinopse(),
                    livro.getAnoPublicacao(),
                    notaMedia,
                    livro.getTotalPaginas(),
                    urlCapa,
                    urlPdf);

            dto.setCriadoEm(livro.getCriadoEm());
            dto.setAtualizadoEm(livro.getAtualizadoEm());

            return Optional.of(dto);
        }

        return Optional.empty();
    }

    public List<LivroDto> listarTodosOsLivros() {
        List<Livro> livros = livroRepository.findAllWithAutor();
        List<Long> ids = livros.stream().map(Livro::getLivroId).collect(Collectors.toList());
        Map<Long, Float> medias = buscarMediasEmLote(ids);

        return livros.stream()
                .map(l -> converterParaLivroDto(l, medias.getOrDefault(l.getLivroId(), 0f)))
                .collect(Collectors.toList());
    }

    private LivroDto converterParaLivroDto(Livro livro) {
        float notaMedia = 0.0f;
        return converterParaLivroDto(livro, notaMedia);
    }

    private LivroDto converterParaLivroDto(Livro livro, float notaMedia) {
        AutorDto autorDto = new AutorDto(livro.getAutor().getAutorId(), livro.getAutor().getNome());
        String urlCapa = gerarUrlCapa(livro);
        String urlPdf = gerarUrlPdf(livro);

        LivroDto dto = new LivroDto(
                livro.getLivroId(),
                livro.getTitulo(),
                autorDto,
                livro.getGenero(),
                livro.getSubgenero(),
                livro.getSinopse(),
                livro.getAnoPublicacao(),
                notaMedia,
                livro.getTotalPaginas(),
                urlCapa,
                urlPdf);
        dto.setCriadoEm(livro.getCriadoEm());
        dto.setAtualizadoEm(livro.getAtualizadoEm());
        return dto;
    }

    private String gerarUrlCapa(Livro livro) {
        String nomeAutor = formatarNomeArquivo(livro.getAutor().getNome());
        String tituloLivro = formatarNomeArquivo(livro.getTitulo());
        return "/assets/images/capa-livro/" + nomeAutor + "/" + tituloLivro + ".jpg";
    }

    private String gerarUrlPdf(Livro livro) {
        String nomeAutor = formatarNomeArquivo(livro.getAutor().getNome());
        String tituloLivro = formatarNomeArquivo(livro.getTitulo());
        return "/livros/pdf/" + nomeAutor + "/" + tituloLivro + ".pdf";    }

    private String formatarNomeArquivo(String nome) {
        return nome
                .replaceAll("[áàâãä]", "a")
                .replaceAll("[éèêë]", "e")
                .replaceAll("[íìîï]", "i")
                .replaceAll("[óòôõö]", "o")
                .replaceAll("[úùûü]", "u")
                .replaceAll("[ç]", "c")
                .replaceAll("[ÁÀÂÃÄ]", "A")
                .replaceAll("[ÉÈÊË]", "E")
                .replaceAll("[ÍÌÎÏ]", "I")
                .replaceAll("[ÓÒÔÕÖ]", "O")
                .replaceAll("[ÚÙÛÜ]", "U")
                .replaceAll("[Ç]", "C")
                .replaceAll("[^a-zA-Z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .toLowerCase();
    }

    public Page<LivroDto> listarPaginado(Pageable pageable) {
        Page<Livro> pagina = livroRepository.findAll(pageable);
        List<Long> ids = pagina.stream().map(Livro::getLivroId).collect(Collectors.toList());
        Map<Long, Float> medias = buscarMediasEmLote(ids);

        List<LivroDto> dtos = pagina.stream()
                .map(l -> converterParaLivroDto(l, medias.getOrDefault(l.getLivroId(), 0f)))
                .collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, pagina.getTotalElements());
    }


    public List<String> listarGeneros() {
        return livroRepository.findDistinctGeneros();
    }

    public List<String> listarSubgenerosPorGenero(String genero) {
        if (genero == null || genero.isBlank()) {
            // retorna todos os subgeneros distintos
            return livroRepository.findDistinctSubgeneros();
        }
        // retorna subgeneros apenas do gênero informado
        return livroRepository.findDistinctSubgenerosByGenero(genero);
    }


    public Page<LivroDto> filtrar(String genero, String subgenero, Pageable pageable, String ordenar) {

        if ("notaAsc".equalsIgnoreCase(ordenar) || "notaDesc".equalsIgnoreCase(ordenar)) {
            return filtrarOrdenarPorNota(genero, subgenero, pageable, ordenar);
        }

        Specification<Livro> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (genero != null && !genero.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("genero")), genero.trim().toLowerCase()));
            }
            if (subgenero != null && !subgenero.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("subgenero")), subgenero.trim().toLowerCase()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Livro> pagina = livroRepository.findAll(spec, pageable);
        List<Long> ids = pagina.stream().map(Livro::getLivroId).collect(Collectors.toList());
        Map<Long, Float> medias = buscarMediasEmLote(ids);

        List<LivroDto> dtos = pagina.stream()
                .map(l -> converterParaLivroDto(l, medias.getOrDefault(l.getLivroId(), 0f)))
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, pagina.getTotalElements());
    }

    private Page<LivroDto> filtrarOrdenarPorNota(String genero, String subgenero, Pageable pageable, String ordenar) {

        Specification<Livro> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (genero != null && !genero.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("genero")), genero.trim().toLowerCase()));
            }
            if (subgenero != null && !subgenero.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("subgenero")), subgenero.trim().toLowerCase()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Livro> todos = livroRepository.findAll(spec);

        if (todos.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        List<Long> idsTodos = todos.stream().map(Livro::getLivroId).collect(Collectors.toList());
        Map<Long, Float> medias = buscarMediasEmLote(idsTodos);

        List<LivroDto> dtos = todos.stream()
                .map(l -> converterParaLivroDto(l, medias.getOrDefault(l.getLivroId(), 0f)))
                .collect(Collectors.toList());

        // ordenar por nota
        boolean asc = "notaAsc".equalsIgnoreCase(ordenar);
        dtos.sort(Comparator.comparing(LivroDto::getNota));
        if (!asc) Collections.reverse(dtos);

        // aplicar paginação manual
        int page = pageable.getPageNumber();
        int size = pageable.getPageSize();
        int start = page * size;
        int end = Math.min(start + size, dtos.size());
        List<LivroDto> sub = start <= end ? dtos.subList(Math.min(start, dtos.size()), end) : List.of();

        return new PageImpl<>(sub, pageable, dtos.size());
    }

    private Map<Long, Float> buscarMediasEmLote(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return Map.of();
        List<Object[]> rows = classificacaoLivrosRepository.findAverageNotaByLivroIds(ids);
        Map<Long, Float> map = new HashMap<>();
        for (Object[] row : rows) {
            Long livroId = ((Number) row[0]).longValue();
            Double avg = (Double) row[1];
            map.put(livroId, avg == null ? 0f : avg.floatValue());
        }
        return map;
    }
}