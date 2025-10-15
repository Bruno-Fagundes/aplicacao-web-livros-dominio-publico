package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.CadastroDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.LoginDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.UsuarioDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Usuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.FuncaoUsuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.StatusUsuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void cadastrar(CadastroDto dto) {
        log.debug("Tentando cadastrar usuário: {}", dto.getNomeUsuario());

        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            log.warn("Tentativa de cadastro com email já existente: {}", dto.getEmail());
            throw new RuntimeException("Email já cadastrado");
        }

        if (usuarioRepository.existsByNomeUsuario(dto.getNomeUsuario())) {
            log.warn("Tentativa de cadastro com nome de usuário já existente: {}", dto.getNomeUsuario());
            throw new RuntimeException("Nome de usuário já existe");
        }

        if (dto.getConfirmarSenha() != null && !dto.getSenha().equals(dto.getConfirmarSenha())) {
            throw new IllegalArgumentException("Senhas não coincidem");
        }

        Usuario usuario = new Usuario();
        usuario.setNomeUsuario(dto.getNomeUsuario());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setStatus(StatusUsuario.ativo);
        usuario.setFuncao(FuncaoUsuario.USER);
        usuario.setCriadoEm(LocalDateTime.now());
        usuario.setAtualizadoEm(LocalDateTime.now());
        usuario.setFotoPerfilUrl("/assets/images/foto-perfil-usuario/foto-perfil.png");

        usuarioRepository.save(usuario);
        log.info("Usuário cadastrado com sucesso: {}", usuario.getNomeUsuario());
    }

    @Override
    public UsuarioDto login(LoginDto dto) {
        log.debug("Tentativa de login com: {}", dto.getNomeUsuarioOuEmail());

        Optional<Usuario> usuarioOpt = usuarioRepository.findByNomeUsuario(dto.getNomeUsuarioOuEmail());

        if (usuarioOpt.isEmpty()) {
            log.debug("Não encontrado por nome de usuário, tentando por email");
            usuarioOpt = usuarioRepository.findByEmail(dto.getNomeUsuarioOuEmail());
        }

        if (usuarioOpt.isEmpty()) {
            log.warn("Usuário não encontrado: {}", dto.getNomeUsuarioOuEmail());
            throw new RuntimeException("Usuário ou senha incorretos");
        }

        Usuario usuario = usuarioOpt.get();
        log.debug("Usuário encontrado: {} (ID: {})", usuario.getNomeUsuario(), usuario.getId());
        log.debug("Senha no banco: {}", usuario.getSenha());
        log.debug("Senha informada: {}", dto.getSenha());

        if (usuario.getStatus() != StatusUsuario.ativo) {
            log.warn("Tentativa de login em conta inativa: {}", usuario.getNomeUsuario());
            throw new RuntimeException("Conta inativa ou bloqueada");
        }

        boolean isSenhaCriptografada = usuario.getSenha().startsWith("$2a$") ||
                usuario.getSenha().startsWith("$2b$") ||
                usuario.getSenha().startsWith("$2y$");

        boolean senhaValida;
        if (isSenhaCriptografada) {
            log.debug("Validando senha criptografada com BCrypt");
            senhaValida = passwordEncoder.matches(dto.getSenha(), usuario.getSenha());
        } else {
            log.warn("ATENÇÃO: Usuário {} tem senha em texto plano no banco!", usuario.getNomeUsuario());
            senhaValida = dto.getSenha().equals(usuario.getSenha());

            if (senhaValida) {
                log.info("Criptografando senha do usuário {} durante o login", usuario.getNomeUsuario());
                usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
            }
        }

        if (!senhaValida) {
            log.warn("Senha incorreta para usuário: {}", usuario.getNomeUsuario());
            throw new RuntimeException("Usuário ou senha incorretos");
        }

        try {
            usuario.setUltimoAcesso(LocalDateTime.now());
            usuario.setAtualizadoEm(LocalDateTime.now());
            usuarioRepository.save(usuario);
            log.debug("Último acesso atualizado para usuário: {}", usuario.getNomeUsuario());
        } catch (Exception e) {
            log.error("Erro ao atualizar último acesso: {}", e.getMessage(), e);
        }

        log.info("Login realizado com sucesso: {}", usuario.getNomeUsuario());

        try {
            UsuarioDto dto2 = convertToDto(usuario);
            log.debug("DTO convertido com sucesso: {}", dto2.getNomeUsuario());
            return dto2;
        } catch (Exception e) {
            log.error("Erro ao converter usuário para DTO: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao processar dados do usuário");
        }
    }

    private UsuarioDto convertToDto(Usuario usuario) {
        try {
            UsuarioDto dto = new UsuarioDto();
            dto.setId(usuario.getId());
            dto.setNomeUsuario(usuario.getNomeUsuario());
            dto.setEmail(usuario.getEmail());
            dto.setStatus(usuario.getStatus());

            if (usuario.getFuncao() != null) {
                dto.setFuncao(usuario.getFuncao().name());
            } else {
                dto.setFuncao("USER");
            }

            dto.setFotoPerfilUrl(usuario.getFotoPerfilUrl());
            dto.setCriadoEm(usuario.getCriadoEm());
            dto.setAtualizadoEm(usuario.getAtualizadoEm());
            dto.setUltimoAcesso(usuario.getUltimoAcesso());

            return dto;
        } catch (Exception e) {
            log.error("Erro ao converter Usuario para DTO: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao processar dados do usuário: " + e.getMessage());
        }
    }
}