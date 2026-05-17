package com.segurancapublica.dashboard.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.segurancapublica.dashboard.model.Ocorrencia;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {

}