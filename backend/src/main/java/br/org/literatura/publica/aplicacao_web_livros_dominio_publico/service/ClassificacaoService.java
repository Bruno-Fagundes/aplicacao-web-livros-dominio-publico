package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.ClassificacaoRequestDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.ClassificacaoLivros;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.ClassificacaoLivrosId;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.EstatisticasLivros;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Livro;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Usuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.ClassificacaoLivrosRepository;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.EstatisticasLivrosRepository;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.LivroRepository;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClassificacaoService {

    private final ClassificacaoLivrosRepository classificacaoRepository;
    private final LivroRepository livroRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstatisticasLivrosRepository estatisticasLivrosRepository;

    @Transactional
    public void avaliarLivro(Long livroId, ClassificacaoRequestDto dto) {
        // Validações
        if (dto.getNota() == null || dto.getNota() < 1 || dto.getNota() > 5) {
            throw new IllegalArgumentException("A nota deve estar entre 1 e 5");
        }

        Livro livro = livroRepository.findById(livroId)
                .orElseThrow(() -> new IllegalArgumentException("Livro não encontrado"));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        Optional<ClassificacaoLivros> classificacaoExistente =
                classificacaoRepository.findByLivroIdAndUsuarioId(livroId, dto.getUsuarioId());

        if (classificacaoExistente.isPresent()) {
            ClassificacaoLivros c = classificacaoExistente.get();
            Float notaAntiga = c.getNota() == null ? 0f : c.getNota();
            c.setNota(dto.getNota().floatValue());
            classificacaoRepository.save(c);

            atualizarEstatisticasAposAlteracao(livroId, notaAntiga.doubleValue(), dto.getNota());
        } else {
            ClassificacaoLivros novaClassificacao = new ClassificacaoLivros();
            novaClassificacao.setId(new ClassificacaoLivrosId(livroId, dto.getUsuarioId()));
            novaClassificacao.setLivro(livro);
            novaClassificacao.setUsuario(usuario);
            novaClassificacao.setNota(dto.getNota().floatValue());
            classificacaoRepository.save(novaClassificacao);

            atualizarEstatisticasAposNova(livroId, dto.getNota());
        }
    }

    public Integer buscarNotaUsuario(Long livroId, Long usuarioId) {
        Optional<ClassificacaoLivros> classificacao =
                classificacaoRepository.findByLivroIdAndUsuarioId(livroId, usuarioId);

        return classificacao.map(c -> c.getNota() == null ? null : c.getNota().intValue()).orElse(null);
    }

    private void atualizarEstatisticasAposNova(Long livroId, Integer novaNota) {
        Optional<EstatisticasLivros> estatOpt = estatisticasLivrosRepository.findByLivroId(livroId);

        if (estatOpt.isPresent()) {
            EstatisticasLivros estat = estatOpt.get();
            Long qtdeAntiga = estat.getQtdeAvaliacao() == null ? 0L : estat.getQtdeAvaliacao();
            Double totalAntigo = estat.getTotalAvaliacao() == null ? 0.0 : estat.getTotalAvaliacao();
            Double somaAntiga = totalAntigo * qtdeAntiga;

            estat.setQtdeAvaliacao(qtdeAntiga + 1);
            estat.setTotalAvaliacao((somaAntiga + novaNota) / (qtdeAntiga + 1));
            estatisticasLivrosRepository.save(estat);
        } else {
            EstatisticasLivros novaEstat = new EstatisticasLivros();
            Livro livro = livroRepository.findById(livroId).orElseThrow();
            novaEstat.setLivroId(livro.getLivroId());
            novaEstat.setQtdeAvaliacao(1L);
            novaEstat.setTotalAvaliacao(novaNota.doubleValue());
            estatisticasLivrosRepository.save(novaEstat);
        }
    }

    private void atualizarEstatisticasAposAlteracao(Long livroId, Double notaAntiga, Integer novaNota) {
        Optional<EstatisticasLivros> estatOpt = estatisticasLivrosRepository.findByLivroId(livroId);

        if (estatOpt.isPresent()) {
            EstatisticasLivros estat = estatOpt.get();
            Long qtde = estat.getQtdeAvaliacao() == null ? 1L : estat.getQtdeAvaliacao();
            Double total = estat.getTotalAvaliacao() == null ? 0.0 : estat.getTotalAvaliacao();
            Double somaTotal = total * qtde;

            somaTotal = somaTotal - notaAntiga + novaNota;
            estat.setTotalAvaliacao(somaTotal / qtde);
            estatisticasLivrosRepository.save(estat);
        }
    }
}
