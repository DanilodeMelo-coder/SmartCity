package com.segurancapublica.dashboard.controller;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.segurancapublica.dashboard.model.Ocorrencia;
import com.segurancapublica.dashboard.repository.OcorrenciaRepository;

import java.util.List;
import java.util.ArrayList;

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
    
    @GetMapping("/proximas")
    public List<Ocorrencia> listarProximas(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5.0") double raioKm) {

        List<Ocorrencia> todas = repo.findAll();
        List<Ocorrencia> proximas = new ArrayList<>();

        for (Ocorrencia o : todas) {
            if (o.getLatitude() == null || o.getLongitude() == null) continue;

            double distancia = calcularDistanciaKm(
                lat, lng,
                o.getLatitude().doubleValue(),
                o.getLongitude().doubleValue()
            );

            if (distancia <= raioKm) {
                proximas.add(o);
            }
        }
        return proximas;
    }

    private double calcularDistanciaKm(double lat1, double lng1, double lat2, double lng2) {
        final double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLng/2) * Math.sin(dLng/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
	
	
}
