package com.segurancapublica.dashboard.config;

import com.segurancapublica.dashboard.service.UsuarioService;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.authentication.AuthenticationManager;

@Configuration
@EnableWebSecurity
public class SecurityConfig{
	@SuppressWarnings("unused")
	 private final UsuarioService usuarioService;

	    public SecurityConfig(UsuarioService usuarioService) {
	        this.usuarioService = usuarioService;
	    }

	    @Bean
	    public PasswordEncoder passwordEncoder() {
	        return new BCryptPasswordEncoder();
	    }
	    
	    @Bean
	    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
	        return config.getAuthenticationManager();
	    }

	    
	    
	    @Bean
	    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	        http
	            .authorizeHttpRequests(auth -> auth
	                .requestMatchers("/login", "/cadastro", "/usuario/cadastrar-cidadao", "/css/**", "/js/**", "/images/**").permitAll()
	                .requestMatchers("/admin/**").hasRole("ADMIN")
	                .requestMatchers("/cidadao/**").hasRole("CIDADAO")
	                .anyRequest().authenticated() // ← sempre por último!
	            )
	            .formLogin(form -> form
	                .loginPage("/login")
	                .successHandler((request, response, auth) -> {
	                    boolean isAdmin = auth.getAuthorities().stream()
	                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
	                    if (isAdmin) {
	                        response.sendRedirect("/admin/home");
	                    } else {
	                        response.sendRedirect("/cidadao/home");
	                    }
	                })
	                .failureUrl("/login?erro")
	                .permitAll()
	            )
	            .logout(logout -> logout
	                .logoutUrl("/logout")
	                .logoutSuccessUrl("/login")
	            );

	        return http.build();
	    }
}
