package com.segurancapublica.dashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.segurancapublica.dashboard.model.Ocorrencia;
import com.segurancapublica.dashboard.repository.OcorrenciaRepository;

import java.util.List;

@RestController
@RequestMapping("/ocorrencias")
@CrossOrigin
public class OcorrenciaController {

    @Autowired
    private OcorrenciaRepository repo;

    @GetMapping
    public List<Ocorrencia> listar() {
        return repo.findAll();
    }
}