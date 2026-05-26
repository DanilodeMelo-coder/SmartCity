package com.segurancapublica.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.segurancapublica.dashboard.model.Ocorrencia;
import java.util.List;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {

    @Query(value = "SELECT b.nome FROM ocorrencias o JOIN bairros b ON o.id_bairro = b.id_bairro GROUP BY o.id_bairro ORDER BY COUNT(o.id_ocorrencia) DESC LIMIT 1", nativeQuery = true)
    String findBairroMaisOcorrencias();

    @Query(value = "SELECT b.nome, COUNT(o.id_ocorrencia) as total FROM ocorrencias o JOIN bairros b ON o.id_bairro = b.id_bairro GROUP BY b.nome ORDER BY total DESC", nativeQuery = true)
    List<Object[]> findOcorrenciasPorBairro();
    
    @Query(value = "SELECT t.nome, COUNT(o.id_ocorrencia) as total FROM ocorrencias o JOIN tipos_ocorrencia t ON o.id_tipo = t.id_tipo GROUP BY t.nome ORDER BY total DESC", nativeQuery = true)
    List<Object[]> findOcorrenciasPorTipo();
    
}