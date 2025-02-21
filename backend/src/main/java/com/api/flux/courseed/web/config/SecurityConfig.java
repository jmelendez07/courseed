package com.api.flux.courseed.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.web.cors.reactive.CorsConfigurationSource;

import com.api.flux.courseed.services.interfaces.Roles;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean 
    SecurityWebFilterChain securityWebFilterChain(
        ServerHttpSecurity serverHttpSecurity,
        ReactiveAuthenticationManager authenticationManager,
        ServerAuthenticationConverter authenticationConverter,
        CorsConfigurationSource configurationSource
    ) throws Exception {

        AuthenticationWebFilter authenticationWebFilter = new AuthenticationWebFilter(authenticationManager);
        authenticationWebFilter.setServerAuthenticationConverter(authenticationConverter);

        serverHttpSecurity
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .cors(cors -> cors.configurationSource(configurationSource))
                .authorizeExchange(exchange -> exchange
                    .pathMatchers("/auth/login", "/auth/register").permitAll()
                    .pathMatchers(HttpMethod.GET, "/categories", "/categories/*", "/categories/name/*").permitAll()
                    .pathMatchers(HttpMethod.POST, "/categories").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.PUT, "/categories/*").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.DELETE, "/categories/*").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.GET, "/contents/*", "/contents/course/*").permitAll()
                    .pathMatchers(HttpMethod.POST, "/contents").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.PUT, "/contents/*").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.DELETE, "/contents/*").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.GET, "/courses", "/courses/*", "/courses/search", "/courses/category/*", "/courses/institution/*").permitAll()
                    .pathMatchers(HttpMethod.POST, "/courses").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.PUT, "/courses/*").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.DELETE, "/courses/*").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.GET, "/institutions", "/institutions/*", "/institutions/name/*", "/institutions/courses/count").permitAll()
                    .pathMatchers(HttpMethod.POST, "/institutions").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.PUT, "/institutions/*").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.DELETE, "/institutions/*").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.GET, "/likes/course/*").permitAll()
                    .pathMatchers(HttpMethod.GET, "/reviews").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.GET, "/reviews/course/*").permitAll()
                    .pathMatchers(HttpMethod.GET, "/users", "/users/*", "users/email/*").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.PUT, "/users/*", "/users/email/*", "/users/password/*", "/users/roles/*").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.DELETE, "/users/*").hasRole(Roles.ADMIN)
                    .pathMatchers(HttpMethod.GET, "/roles").hasRole(Roles.ADMIN)
                    .anyExchange().authenticated())
                .addFilterAt(authenticationWebFilter, SecurityWebFiltersOrder.AUTHENTICATION);

        return serverHttpSecurity.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
