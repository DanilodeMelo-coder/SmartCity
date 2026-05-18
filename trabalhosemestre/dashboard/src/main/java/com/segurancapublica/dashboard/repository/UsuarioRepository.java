package com.segurancapublica.dashboard.repository;

import com.segurancapublica.dashboard.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

//repositorio jpa para a entidade usuario

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
	  
	
	Optional<Usuario> findByCpf(String cpf); // busca usuario por cpf, é bom pra verificar duplicidade no cadastro

	Optional<Usuario> findByEmail(String email); // busca usuario pelo email, vê duplicidade
	
	boolean existsByCpf(String cpf); // verifica se ja existe alguem com esse cpf
	
	boolean existsByEmail(String email); // valida se ja tem alguem com esse email
	
	List<Usuario> findByIdTipoUsuario(Integer idTipoUsuario); // lista todos os usuários de um determinado tipo (1 é admin e 2 é cidadão)
	
	List<Usuario> findByIdTipoUsuarioAndAtivo(Integer idTipoUsuario, Integer ativo);
}