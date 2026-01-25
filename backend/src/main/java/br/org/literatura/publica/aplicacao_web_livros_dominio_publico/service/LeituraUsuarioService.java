package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.ProgressoDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.EstatisticasLivros;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.LeituraUsuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.LeituraUsuarioId;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Livro;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Usuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.EstatisticasLivrosRepository;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.LeituraUsuarioRepository;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.LivroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class LeituraUsuarioService {

    private final LeituraUsuarioRepository leituraRepo;
    private final LivroRepository livroRepo;
    private final EstatisticasLivrosRepository estatRepo;

    public LeituraUsuarioService(LeituraUsuarioRepository leituraRepo, LivroRepository livroRepo, EstatisticasLivrosRepository estatRepo) {
        this.leituraRepo = leituraRepo;
        this.livroRepo = livroRepo;
        this.estatRepo = estatRepo;
    }

    @Transactional(readOnly = true)
    public ProgressoDto buscarProgresso(Long usuarioId, Long livroId) {
        Optional<LeituraUsuario> opt = leituraRepo.findByIdUsuarioIdAndIdLivroId(usuarioId, livroId);
        if (opt.isEmpty()) return null;
        LeituraUsuario l = opt.get();
        return new ProgressoDto(l.getLivro().getLivroId(), l.getUltimaPaginaLida(), l.getPorcentagemLida());
    }

    @Transactional
    public ProgressoDto salvarProgresso(Long usuarioId, Long livroId, Integer paginaAtual) {
        if (paginaAtual == null || paginaAtual < 1) paginaAtual = 1;

        Livro livro = livroRepo.findById(livroId)
                .orElseThrow(() -> new IllegalArgumentException("Livro não encontrado: " + livroId));

        Optional<LeituraUsuario> opt = leituraRepo.findByIdUsuarioIdAndIdLivroId(usuarioId, livroId);
        LeituraUsuario leitura;
        boolean isNew = false;
        if (opt.isPresent()) {
            leitura = opt.get();
        } else {
            leitura = new LeituraUsuario();
            LeituraUsuarioId id = new LeituraUsuarioId(usuarioId, livroId);
            leitura.setId(id);
            Usuario u = new Usuario(); u.setUsuarioId(usuarioId);
            leitura.setUsuario(u);
            leitura.setLivro(livro);
            leitura.setUltimaLeitura(LocalDateTime.now());
            isNew = true;
        }

        leitura.setUltimaPaginaLida(paginaAtual);
        int total = livro.getTotalPaginas() <= 0 ? 1 : livro.getTotalPaginas();
        double porcent = (100.0 * paginaAtual) / total;
        if (porcent > 100.0) porcent = 100.0;
        leitura.setPorcentagemLida(porcent);
        leitura.setUltimaLeitura(LocalDateTime.now());

        leituraRepo.save(leitura);

        if (isNew) {
            EstatisticasLivros estat = estatRepo.findByLivroId(livroId).orElseGet(() -> {
                EstatisticasLivros e = new EstatisticasLivros();
                e.setLivroId(livroId);
                e.setTotalLeitura(0);
                e.setTotalAvaliacao(0.0);
                e.setQtdeAvaliacao(0L);
                e.setAtualizadoEm(LocalDateTime.now());
                return e;
            });
            estat.setTotalLeitura((estat.getTotalLeitura() == null ? 0 : estat.getTotalLeitura()) + 1);
            estat.setAtualizadoEm(LocalDateTime.now());
            estatRepo.save(estat);
        }

        return new ProgressoDto(livroId, paginaAtual, porcent);
    }
}
