package com.segurancapublica.dashboard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import com.segurancapublica.dashboard.model.Ocorrencia;
import com.segurancapublica.dashboard.model.Usuario;
import com.segurancapublica.dashboard.service.OcorrenciaService;
import com.segurancapublica.dashboard.service.UsuarioService;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final OcorrenciaService ocorrenciaService;
    private final UsuarioService usuarioService;

    public AuthController(AuthenticationManager authenticationManager,
                          OcorrenciaService ocorrenciaService,
                          UsuarioService usuarioService) {
        this.authenticationManager = authenticationManager;
        this.ocorrenciaService = ocorrenciaService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String cpf = body.get("cpf").replaceAll("[^0-9]", "");
            String senha = body.get("senha");

            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cpf, senha)
            );

            boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            return ResponseEntity.ok(Map.of(
                "sucesso", true,
                "tipo", isAdmin ? "ADMIN" : "CIDADAO",
                "redirect", isAdmin ? "/admin/home" : "/cidadao/home"
            ));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of(
                "sucesso", false,
                "mensagem", "CPF ou senha incorretos"
            ));
        }
    }

    @PostMapping("/ocorrencia")
    public ResponseEntity<?> cadastrarOcorrencia(@RequestBody Map<String, Object> body) {
        try {
            Ocorrencia ocorrencia = new Ocorrencia();
            ocorrencia.setTitulo((String) body.get("titulo"));
            ocorrencia.setDescricao((String) body.get("descricao"));
            ocorrencia.setIdTipo((Integer) body.get("idTipo"));
            ocorrencia.setIdGravidade((Integer) body.get("idGravidade"));
            ocorrencia.setIdBairro((Integer) body.get("idBairro"));
            ocorrencia.setIdUsuarioCriador((Integer) body.get("idUsuarioCriador"));
            ocorrencia.setLatitude(new BigDecimal(body.get("latitude").toString()));
            ocorrencia.setLongitude(new BigDecimal(body.get("longitude").toString()));

            Ocorrencia salva = ocorrenciaService.cadastrar(ocorrencia);

            return ResponseEntity.ok(Map.of(
                "sucesso", true,
                "id", salva.getId()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "sucesso", false,
                "mensagem", "Erro ao cadastrar ocorrência: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/ocorrencias")
    public ResponseEntity<?> listarOcorrencias() {
        try {
            List<Ocorrencia> lista = ocorrenciaService.listarTodas();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "sucesso", false,
                "mensagem", e.getMessage()
            ));
        }
    }

    @PostMapping("/cadastrar-cidadao")
    public ResponseEntity<?> cadastrarCidadao(@RequestBody Map<String, Object> body) {
        try {
            Usuario usuario = new Usuario();
            usuario.setNome((String) body.get("nome"));
            usuario.setCpf((String) body.get("cpf"));
            usuario.setTelefone((String) body.get("telefone"));
            usuario.setEmail((String) body.get("email"));
            usuario.setSenha((String) body.get("senha"));

            String dataNasc = (String) body.get("dataNascimento");
            usuario.setDataNascimento(java.time.LocalDate.parse(dataNasc));

            usuarioService.cadastrarCidadao(usuario);
            return ResponseEntity.ok(Map.of("sucesso", true));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erro ao cadastrar: " + e.getMessage()));
        }
    }
}