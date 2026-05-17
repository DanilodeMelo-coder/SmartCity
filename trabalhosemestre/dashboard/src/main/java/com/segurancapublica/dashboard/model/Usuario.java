package com.segurancapublica.dashboard.model;


import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table (name = "usuarios")
public class Usuario {
	
	// campos mapeados conforme o banco
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column (name = "id_usuario")
	private Integer id;
	
	@Column (name = "nome", nullable = false, length = 100)
	private String nome;
	
	@Column (name = "email", length = 100) //email é opcional para o cidadão
	private String email;
	
	@Column (name = "senha", nullable = false, length = 100)
	private String senha;
	
	@Column (name = "data_nascimento")
	private LocalDate dataNascimento;
	
	@Column (name = "id_tipo_usuario", nullable = false)
	private Integer idTipoUsuario;
	
	@Column (name = "CPF", nullable = false, length = 11, unique = true)
	private String cpf;
	
	@Column (name = "telefone", length = 20)
	private String telefone;
	
	@Column (name = "data_criacao", updatable = false)
	private LocalDateTime dataCriacao;
	
	@Column (name = "Ativo")
	private Boolean ativo; // preenche a data de criação e o ativo automaticamente

	
	@PrePersist
	public void prePersist() {
		this.dataCriacao = LocalDateTime.now();
		if (this.ativo == null) {
			this.ativo = true; // ativo sempre por padrão
		}
	}
	
	public Usuario () {}

	public Usuario(String nome, String cpf, String telefone, LocalDate dataNascimento, String senha, String email) {
	
		this.nome = nome;
		this.cpf = cpf;
		this.telefone = telefone;
		this.dataNascimento = dataNascimento;
		this.senha = senha;
		this.email = email;
		this.idTipoUsuario = 2; // cidadão
	}
	
	// parte dos getters e setters, muito chato
	
	public Integer getId() {return id; }
	public void setId(Integer id) {this.id = id; }
	
	public String getNome() {return nome; }
	public void setNome(String nome) {this.nome = nome; }
	
	public String getEmail() {return email; }
	public void setEmail(String email) {this.email = email; }
	
	public String getSenha() {return senha; }
	public void setSenha(String senha) {this.senha = senha; }
	
	public LocalDate getDataNascimento() {return dataNascimento; }
	public void setDataNascimento(LocalDate dataNascimento) {this.dataNascimento = dataNascimento; }
	
	public Integer getIdTipoUsuario() {return idTipoUsuario; }
	public void setIdTipoUsuario(Integer idTipoUsuario) {this.idTipoUsuario = idTipoUsuario; }
	
	public String getCpf() {return cpf; }
	public void setCpf(String cpf) {this.cpf = cpf; }
	
	public String getTelefone() {return telefone; }
	public void setTelefone(String telefone) {this.telefone = telefone; }
	
	public LocalDateTime getDataCriacao() {return dataCriacao; }
	public void setDataCriacao(LocalDateTime dataCriacao) {this.dataCriacao = dataCriacao; }
	
	public Boolean getAtivo() {return ativo; }
	public void setAtivo(Boolean ativo) {this.ativo = ativo; }
	
	
	// mostra true se o usuario for admin
	public boolean isAdmin() {
		return Integer.valueOf(1).equals(this.idTipoUsuario);
	}
	
	//mostra true se o usuario for cidadao
	public boolean isCidadao() {
		return Integer.valueOf(2).equals(this.idTipoUsuario);
	}
	
	@Override // sem isso, se vc fosse tentar imprimir um objeto Usuario, o Java só mostraria o nome da classe + o endereço de memória (o que seria inútil)
	public String toString() {
		return "Usuario{id=" + id + ", nome='" + nome + "', cpf='" + cpf
				+ "', tipo=" + idTipoUsuario + "}";
	}
	
}