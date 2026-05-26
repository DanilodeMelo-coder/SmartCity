package com.segurancapublica.dashboard.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/admin/home")
    public String adminHome() {
        return "admin/home";
    }

    @GetMapping("/cidadao/home")
    public String cidadaoHome() {
        return "redirect:/cidadao/cidadao.html";
    }
}