package com.gateway_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri:http://auth:8081/.well-known/jwks.json}")
    private String jwkSetUri;

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        return NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http, ReactiveJwtDecoder jwtDecoder) {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.and())
                .authorizeExchange(exchanges -> exchanges
                        // CORS preflight requests
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        
                        // Public endpoints - no authentication required
                        .pathMatchers(HttpMethod.GET, "/actuator/health").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/auth/register", "/api/auth/login").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/auth/google").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/auth/oauth2/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/auth/me").permitAll()
                        
                        // Public catalog endpoints
                        .pathMatchers(HttpMethod.GET, "/api/catalog/home").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/catalog/products").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/catalog/products/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/catalog/stores/**").permitAll()
                        
                        // Public search endpoints
                        .pathMatchers(HttpMethod.GET, "/api/search").permitAll()
                        
                        // Public review endpoints (read only)
                        .pathMatchers(HttpMethod.GET, "/api/review/product/**").permitAll()
                        
                        // Cart operations (allow anonymous)
                        .pathMatchers(HttpMethod.POST, "/api/order/cart/items").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/order/checkout").permitAll()
                        
                        // Admin endpoints
                        .pathMatchers(HttpMethod.GET, "/api/auth/users").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/auth/users/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/auth/users/*/roles").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/catalog/stores/*/approve").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/catalog/products/*/active").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.GET, "/api/seller/applications").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/seller/applications/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PATCH, "/api/review/*/approve").hasRole("ADMIN")
                        
                        // Seller endpoints
                        .pathMatchers("/api/catalog/my/**").hasRole("SELLER")
                        .pathMatchers(HttpMethod.POST, "/api/catalog/products").hasRole("SELLER")
                        .pathMatchers("/api/seller/me/**").hasRole("SELLER")
                        
                        // Any other request requires authentication
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtDecoder(jwtDecoder)
                                .jwtAuthenticationConverter(new JwtAuthenticationConverter())
                        )
                )
                .build();
    }
}
