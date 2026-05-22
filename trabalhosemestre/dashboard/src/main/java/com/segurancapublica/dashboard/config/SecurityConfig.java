package com.segurancapublica.dashboard.config;

import com.segurancapublica.dashboard.service.UsuarioService;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig{
	@SuppressWarnings("unused")
	 private final UsuarioService usuarioService;

	    public SecurityConfig(UsuarioService usuarioService) {
	        this.usuarioService = usuarioService;
	    }
	    
	    @Bean
	    public CorsConfigurationSource corsConfigurationSource() {
	        CorsConfiguration config = new CorsConfiguration();
	        config.setAllowedOrigins(List.of("http://127.0.0.1:5500"));
	        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	        config.setAllowedHeaders(List.of("*"));
	        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	        source.registerCorsConfiguration("/**", config);
	        return source;  
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
	            .cors(Customizer.withDefaults())
	            .authorizeHttpRequests(auth -> auth
	                .requestMatchers("/login", "/cadastro", "/api/**", "/usuario/cadastrar-cidadao", "/css/**", "/js/**", "/images/**").permitAll()
	                .requestMatchers("/admin/**").hasRole("ADMIN")
	                .requestMatchers("/cidadao/**").hasRole("CIDADAO")
	                .anyRequest().authenticated()
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
	            )
	            .exceptionHandling(ex -> ex
	                .authenticationEntryPoint((request, response, authException) -> {
	                    response.setStatus(401);
	                    response.setContentType("application/json");
	                    response.getWriter().write("{\"sucesso\": false, \"mensagem\": \"Não autenticado\"}");
	                })
	            );

	        return http.build();
	    }
};

