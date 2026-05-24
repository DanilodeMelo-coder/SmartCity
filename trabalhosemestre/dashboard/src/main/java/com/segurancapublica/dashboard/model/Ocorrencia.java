package com.segurancapublica.dashboard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name="ocorrencias")
public class Ocorrencia {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_ocorrencia")
	private Integer id; // era long, tava errado e mudei pra Integer (mudei nos getters e setters também)
	
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

	    @Column(name = "id_usuario_criador")
	    private Integer idUsuarioCriador;

	    @Column(name = "id_tipo")
	    private Integer idTipo;

	    @Column(name = "id_bairro")
	    private Integer idBairro;

	    @Column(name = "id_status")
	    private Integer idStatus;

	    @Column(name = "id_gravidade")
	    private Integer idGravidade;

	    @Column(name = "id_origem")
	    private Integer idOrigem;

	    @Column(name = "tempo_resposta_minutos")
	    private Integer tempoRespostaMinutos;

	    @Column(name = "latitude", precision = 9, scale = 6)
	    private BigDecimal latitude;
	    
	    @Column(name = "longitude", precision = 9, scale = 6)
	    private BigDecimal longitude;
	    
		public Integer getId() {
			return id;
		}

		public void setId(Integer id) {
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

		public Integer getIdUsuarioCriador() {
			return idUsuarioCriador;
		}

		public void setIdUsuarioCriador(Integer idUsuarioCriador) {
			this.idUsuarioCriador = idUsuarioCriador;
		}

		public Integer getIdTipo() {
			return idTipo;
		}

		public void setIdTipo(Integer idTipo) {
			this.idTipo = idTipo;
		}

		public Integer getIdBairro() {
			return idBairro;
		}

		public void setIdBairro(Integer idBairro) {
			this.idBairro = idBairro;
		}

		public Integer getIdStatus() {
			return idStatus;
		}

		public void setIdStatus(Integer idStatus) {
			this.idStatus = idStatus;
		}

		public Integer getIdGravidade() {
			return idGravidade;
		}

		public void setIdGravidade(Integer idGravidade) {
			this.idGravidade = idGravidade;
		}

		public Integer getIdOrigem() {
			return idOrigem;
		}

		public void setIdOrigem(Integer idOrigem) {
			this.idOrigem = idOrigem;
		}

		public Integer getTempoRespostaMinutos() {
			return tempoRespostaMinutos;
		}

		public void setTempoRespostaMinutos(Integer tempoRespostaMinutos) {
			this.tempoRespostaMinutos = tempoRespostaMinutos;
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
		
		public BigDecimal getLatitude() {
			return latitude;
		}
		
		public void setLatitude(BigDecimal latitude) {
			this.latitude = latitude;
		}

		public BigDecimal getLongitude() {
			return longitude;
		}
		
		public void setLongitude(BigDecimal longitude) {
			this.longitude = longitude;
		}
}
