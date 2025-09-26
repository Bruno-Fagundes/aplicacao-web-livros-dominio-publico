package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.ClassificacaoRequestDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.*;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ClassificacaoService {

    private final ClassificacaoLivrosRepository classificacaoRepo;
    private final LivroRepository livroRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstatisticasLivrosRepository estatisticasRepo;

    @Transactional
    public void avaliarLivro(Long livroId, ClassificacaoRequestDto dto) {
        if (dto.getNota() == null || dto.getNota() < 1 || dto.getNota() > 5) {
            throw new IllegalArgumentException("Nota deve ser entre 1 e 5");
        }

        Livro livro = livroRepository.findById(livroId)
                .orElseThrow(() -> new IllegalArgumentException("Livro não encontrado: " + livroId));
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado: " + dto.getUsuarioId()));

        ClassificacaoLivrosId id = new ClassificacaoLivrosId(livroId, dto.getUsuarioId());

        ClassificacaoLivros classificacao = classificacaoRepo.findById(id).orElseGet(() -> {
            ClassificacaoLivros c = new ClassificacaoLivros();
            c.setId(id);
            c.setLivro(livro);
            c.setUsuario(usuario);
            return c;
        });

        classificacao.setNota(dto.getNota().floatValue());
        classificacaoRepo.save(classificacao);

        // recalcula média e quantidade a partir da tabela de classificações
        Double media = classificacaoRepo.findAverageNotaByLivroId(livroId);
        long quantidade = classificacaoRepo.countByLivro_LivroId(livroId);

        EstatisticasLivros estat = estatisticasRepo.findByLivroId(livroId).orElseGet(() -> {
            EstatisticasLivros e = new EstatisticasLivros();
            e.setLivroId(livroId);
            e.setTotalLeitura(0);
            return e;
        });

        estat.setTotalAvaliacao(media);
        estat.setQtdeAvaliacao(quantidade);
        estat.setAtualizadoEm(LocalDateTime.now());

        estatisticasRepo.save(estat);
    }
}
