package com.segurancapublica.dashboard.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import com.segurancapublica.dashboard.model.Usuario;

@Controller
public class LoginController {
	@GetMapping("/login")
	public String login() {
		return "login";
	}
	
	@GetMapping("/admin/home")
	public String adminhome() {
		return "admin/home";
	}
	
	@GetMapping("/user/home")
	public String userhome() {
		return "user/home";
		}
	
	@GetMapping("/cadastro")
	public String cadastro(Model model) {
	    model.addAttribute("usuario", new Usuario()); // ← isso resolve o erro
	    return "usuario/cadastro-cidadao";
	}
	}

