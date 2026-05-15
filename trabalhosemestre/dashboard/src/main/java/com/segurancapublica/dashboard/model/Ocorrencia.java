package com.segurancapublica.dashboard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="ocorrencias")
public class Ocorrencia {
	
	@Id
	@Column(name="id_ocorrencia")
	private long id;
	
	private String titulo;
	private String descricao;
	
	   @Column(name = "data_ocorrencia")
	    private LocalDateTime dataOcorrencia;

	    @Column(name = "data_criacao")
	    private LocalDateTime dataCriacao;

	    @Column(name = "data_atualizacao")
	    private LocalDateTime dataAtualizacao;

	    @Column(name = "data_resolucao")
	    private LocalDateTime dataResolucao;

	    @Column(name = "id_usuario")
	    private Long idUsuario;

	    @Column(name = "id_tipo")
	    private Long idTipo;

	    @Column(name = "id_bairro")
	    private Long idBairro;

	    @Column(name = "id_status")
	    private Long idStatus;

	    @Column(name = "id_gravidade")
	    private Long idGravidade;

	    @Column(name = "id_origem")
	    private Long idOrigem;

	    @Column(name = "tempo_resposta_minutos")
	    private Integer tempoRespostaMinutos;

	    @Column(name = "nivel_impacto")
	    private String nivelImpacto;

	    private Boolean resolvido;
	    
	    @Column(name = "horario_incidente")
	    private LocalDateTime horarioIncidente;

	    
	    public Boolean getResolvido() {
			return resolvido;
		}

		public long getId() {
			return id;
		}

		public void setId(long id) {
			this.id = id;
		}

		public LocalDateTime getDataOcorrencia() {
			return dataOcorrencia;
		}

		public void setDataOcorrencia(LocalDateTime dataOcorrencia) {
			this.dataOcorrencia = dataOcorrencia;
		}

		public LocalDateTime getDataCriacao() {
			return dataCriacao;
		}

		public void setDataCriacao(LocalDateTime dataCriacao) {
			this.dataCriacao = dataCriacao;
		}

		public LocalDateTime getDataAtualizacao() {
			return dataAtualizacao;
		}

		public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
			this.dataAtualizacao = dataAtualizacao;
		}

		public LocalDateTime getDataResolucao() {
			return dataResolucao;
		}

		public void setDataResolucao(LocalDateTime dataResolucao) {
			this.dataResolucao = dataResolucao;
		}

		public Long getIdUsuario() {
			return idUsuario;
		}

		public void setIdUsuario(Long idUsuario) {
			this.idUsuario = idUsuario;
		}

		public Long getIdTipo() {
			return idTipo;
		}

		public void setIdTipo(Long idTipo) {
			this.idTipo = idTipo;
		}

		public Long getIdBairro() {
			return idBairro;
		}

		public void setIdBairro(Long idBairro) {
			this.idBairro = idBairro;
		}

		public Long getIdStatus() {
			return idStatus;
		}

		public void setIdStatus(Long idStatus) {
			this.idStatus = idStatus;
		}

		public Long getIdGravidade() {
			return idGravidade;
		}

		public void setIdGravidade(Long idGravidade) {
			this.idGravidade = idGravidade;
		}

		public Long getIdOrigem() {
			return idOrigem;
		}

		public void setIdOrigem(Long idOrigem) {
			this.idOrigem = idOrigem;
		}

		public Integer getTempoRespostaMinutos() {
			return tempoRespostaMinutos;
		}

		public void setTempoRespostaMinutos(Integer tempoRespostaMinutos) {
			this.tempoRespostaMinutos = tempoRespostaMinutos;
		}

		public String getNivelImpacto() {
			return nivelImpacto;
		}

		public void setNivelImpacto(String nivelImpacto) {
			this.nivelImpacto = nivelImpacto;
		}

		public LocalDateTime getHorarioIncidente() {
			return horarioIncidente;
		}

		public void setHorarioIncidente(LocalDateTime horarioIncidente) {
			this.horarioIncidente = horarioIncidente;
		}

		public void setResolvido(Boolean resolvido) {
			this.resolvido = resolvido;
		}

		public String getTitulo() {
		    return titulo;
		}

		public void setTitulo(String titulo) {
		    this.titulo = titulo;
		}
		
		
		public String getDescricao() {
		    return descricao;
		}

		public void setDescricao(String descricao) {
		    this.descricao = descricao;
		}
}
