package com.segurancapublica.dashboard.controller;

import com.segurancapublica.dashboard.model.Usuario;
import com.segurancapublica.dashboard.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // cidadao

    // Exibe formulário
    @GetMapping("/cadastrar-cidadao")
    public String exibirFormCidadao(Model model) {

        model.addAttribute("usuario", new Usuario());

        return "usuario/cadastro-cidadao";
    }

    // Processa cadastro
    @PostMapping("/cadastrar-cidadao")
    public String processarCadastroCidadao(
            @ModelAttribute Usuario usuario,
            Model model) {

        try {

            usuarioService.cadastrarCidadao(usuario);

            return "redirect:/login?sucesso";

        } catch (IllegalArgumentException e) {

            model.addAttribute("erro", e.getMessage());

            return "usuario/cadastro-cidadao";
        }
    }

    // adm

    // Exibe formulário adm
    @GetMapping("/cadastrar-admin")
    public String exibirFormAdmin(Model model) {

        model.addAttribute("usuario", new Usuario());

        return  "redirect:/usuario/cadastrar-cidadao";
    }

    // Processa admin
    @PostMapping("/cadastrar-admin")
    public String processarCadastroAdmin(
            @ModelAttribute Usuario usuario,
            Model model) { 

        try {

            usuarioService.cadastrarAdmin(usuario);

            return "redirect:/login?sucesso";

        } catch (IllegalArgumentException e) {

            model.addAttribute("erro", e.getMessage());

            return "usuario/cadastro-admin";
        }
    }
}