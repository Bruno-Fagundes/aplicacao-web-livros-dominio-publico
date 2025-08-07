package br.org.literatura.publica.aplicacao_web_livros_dominio_publico.service;

import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.CadastroDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.LoginDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.dto.UsuarioDto;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.Usuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.FuncaoUsuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.model.StatusUsuario;
import br.org.literatura.publica.aplicacao_web_livros_dominio_publico.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public void cadastrar(CadastroDto dto) {
        // Validar se o email já existe
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        // Validar se o nome de usuário já existe
        if (usuarioRepository.existsByNomeUsuario(dto.getNomeUsuario())) {
            throw new RuntimeException("Nome de usuário já existe");
        }

        // Validar se as senhas coincidem
        if (dto.getConfirmarSenha() != null && !dto.getSenha().equals(dto.getConfirmarSenha())) {
            throw new RuntimeException("Senhas não coincidem");
        }

        Usuario usuario = new Usuario();
        usuario.setNomeUsuario(dto.getNomeUsuario()); // CORREÇÃO: Setando o nomeUsuario
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha()); // Em produção, usar BCrypt para criptografar
        usuario.setStatus(StatusUsuario.ativo); // CORREÇÃO: Definindo status padrão
        usuario.setFuncao(FuncaoUsuario.USER); // CORREÇÃO: Definindo função padrão
        usuario.setCriadoEm(LocalDateTime.now());
        usuario.setAtualizadoEm(LocalDateTime.now());
        usuario.setFotoPerfilUrl("/assets/images/foto-perfil-usuario/foto-perfil.png");

        usuarioRepository.save(usuario);
    }

    @Override
    public UsuarioDto login(LoginDto dto) {
        Usuario usuario = usuarioRepository.findByNomeUsuarioOuEmail(dto.getNomeUsuarioOuEmail())
                .orElseThrow(() -> new RuntimeException("Usuário/E-mail não encontrado"));

        if (!usuario.getSenha().equals(dto.getSenha())) {
            throw new RuntimeException("Senha incorreta");
        }

        usuario.setUltimoAcesso(LocalDateTime.now());
        usuarioRepository.save(usuario);

        return convertToDto(usuario);
    }

    private UsuarioDto convertToDto(Usuario usuario) {
        UsuarioDto dto = new UsuarioDto();
        dto.setId(usuario.getId());
        dto.setNomeUsuario(usuario.getNomeUsuario());
        dto.setSenha(usuario.getSenha());
        dto.setEmail(usuario.getEmail());
        dto.setStatus(usuario.getStatus());
        dto.setFuncao(usuario.getFuncao().toString());
        dto.setFotoPerfilUrl(usuario.getFotoPerfilUrl());
        dto.setCriadoEm(usuario.getCriadoEm());
        dto.setAtualizadoEm(usuario.getAtualizadoEm());
        dto.setUltimoAcesso(usuario.getUltimoAcesso());
        return dto;
    }
}