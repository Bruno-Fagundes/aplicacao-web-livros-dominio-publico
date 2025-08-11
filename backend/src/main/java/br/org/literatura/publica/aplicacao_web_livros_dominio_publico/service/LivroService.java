package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.AutorDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.LivroDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Livro;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.ClassificacaoLivrosRepository;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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

            // busca a média das notas na tabela classificacao_livro
            Double avg = classificacaoLivrosRepository.findAverageNotaByLivroId(id);
            float notaMedia = avg == null ? 0f : avg.floatValue();

            String urlCapa = gerarUrlCapa(livro);
            String urlPdf = gerarUrlPdf(livro);

            // Criando a DTO do autor com apenas os dados necessários
            AutorDto autorDto = new AutorDto();

            LivroDto dto = new LivroDto(
                    livro.getLivroId(),
                    livro.getTitulo(),
                    autorDto, // Passando o objeto AutorDto
                    livro.getGenero(),
                    livro.getSubgenero(),
                    livro.getSinopse(),
                    livro.getAnoPublicacao(),
                    notaMedia,
                    livro.getTotalPaginas(),
                    urlCapa,
                    urlPdf);

            return Optional.of(dto);
        }

        return Optional.empty();
    }


    // Novo método para listar todos os livros
    public List<LivroDto> listarTodosOsLivros() {
        List<Livro> livros = livroRepository.findAllWithAutor();
        return livros.stream()
                .map(this::converterParaLivroDto)
                .collect(Collectors.toList());
    }

    // Método auxiliar para converter Livro em LivroDto
    private LivroDto converterParaLivroDto(Livro livro) {
        AutorDto autorDto = new AutorDto();
        String urlCapa = gerarUrlCapa(livro);
        String urlPdf = gerarUrlPdf(livro);

        // Nota média não será calculada na listagem para performance, será 0 por enquanto
        float notaMedia = 0.0f;

        return new LivroDto(
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
                urlPdf
        );
    }

    private String gerarUrlCapa(Livro livro) {
        String nomeAutor = formatarNomeArquivo(livro.getAutor().getNome());
        String tituloLivro = formatarNomeArquivo(livro.getTitulo());
        return "/assets/images/capa-livro/" + nomeAutor + "/" + tituloLivro + ".jpg";
    }

    private String gerarUrlPdf(Livro livro) {
        String nomeAutor = formatarNomeArquivo(livro.getAutor().getNome());
        String tituloLivro = formatarNomeArquivo(livro.getTitulo());
        return "/api/livros/pdf/" + nomeAutor + "/" + tituloLivro + ".pdf";
    }

    private String formatarNomeArquivo(String nome) {
        // Remove acentos e caracteres especiais, substitui espaços por hífens
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
}
