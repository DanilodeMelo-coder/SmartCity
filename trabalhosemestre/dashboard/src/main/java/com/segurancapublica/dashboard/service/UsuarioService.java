package com.segurancapublica.dashboard.service;

import com.segurancapublica.dashboard.model.Usuario;

import com.segurancapublica.dashboard.repository.UsuarioRepository;
import com.segurancapublica.dashboard.util.Cript_senha;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class UsuarioService implements UserDetailsService{

    @Autowired
    private UsuarioRepository usuarioRepository;
    
   
    /** * Cadastra um cidadão (idTipoUsuario = 2).*/
    
    public Usuario cadastrarCidadao(Usuario usuario) {

        // CPF duplicado
        if (usuarioRepository.existsByCpf(usuario.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }

        // E-mail duplicado
        if (usuario.getEmail() != null &&
            !usuario.getEmail().isEmpty() &&
            usuarioRepository.existsByEmail(usuario.getEmail())) {

            throw new IllegalArgumentException("E-mail já cadastrado.");
        }

        // Senha mínima
        if (usuario.getSenha() == null ||
            usuario.getSenha().length() < 8) {

            throw new IllegalArgumentException("A senha deve ter no mínimo 8 caracteres.");
        }

        // Tipo cidadão
        usuario.setIdTipoUsuario(2);
        
        usuario.setSenha(Cript_senha.hash(usuario.getSenha())); // isso criptografa a senha antes de salvar

        return usuarioRepository.save(usuario);
    }

    /** * Cadastra administrador (idTipoUsuario = 1). */
    
    public Usuario cadastrarAdmin(Usuario usuario) {

        // E-mail obrigatório
        if (usuario.getEmail() == null ||
            usuario.getEmail().isEmpty()) {

            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        // Reutiliza validações
        if (usuarioRepository.existsByCpf(usuario.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }

        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }

        if (usuario.getSenha() == null ||
            usuario.getSenha().length() < 8) {

            throw new IllegalArgumentException("A senha deve ter no mínimo 8 caracteres.");
        }

        // Tipo admin
        usuario.setIdTipoUsuario(1);
        
        usuario.setSenha(Cript_senha.hash(usuario.getSenha())); // cript senha antes de salvar

        return usuarioRepository.save(usuario);
    }


	@Override
	public UserDetails loadUserByUsername(String cpf) throws UsernameNotFoundException {

	    // remove pontos e traço do CPF antes de buscar no banco
	    String cpfLimpo = cpf.replaceAll("[^0-9]", "");

	    Usuario usuario = usuarioRepository.findByCpf(cpfLimpo)
	        .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

	    if (Boolean.FALSE.equals(usuario.getAtivo())) {
	        throw new UsernameNotFoundException("Usuário inativo");
	    }

	    String role = usuario.isAdmin() ? "ADMIN" : "CIDADAO";

	    return User.builder()
	        .username(usuario.getCpf())
	        .password(usuario.getSenha())
	        .roles(role)
	        .build();
	}
}