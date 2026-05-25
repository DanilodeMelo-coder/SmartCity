package com.segurancapublica.dashboard.service;

import com.segurancapublica.dashboard.model.Ocorrencia;
import com.segurancapublica.dashboard.repository.OcorrenciaRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrenciaRepository;

    public OcorrenciaService(OcorrenciaRepository ocorrenciaRepository) {
        this.ocorrenciaRepository = ocorrenciaRepository;
    }

    public Ocorrencia cadastrar(Ocorrencia ocorrencia) {
        ocorrencia.setDataCriacao(LocalDateTime.now());
        ocorrencia.setDataOcorrencia(LocalDateTime.now());
        ocorrencia.setIdStatus(1);   // status padrão: aberta
        ocorrencia.setIdOrigem(1);   // origem padrão: cidadão
        return ocorrenciaRepository.save(ocorrencia);
    }


public List<Ocorrencia> listarTodas() {
    return ocorrenciaRepository.findAll();
}

}