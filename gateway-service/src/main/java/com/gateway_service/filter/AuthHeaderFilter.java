package com.gateway_service.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class AuthHeaderFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return ReactiveSecurityContextHolder.getContext()
                .map(securityContext -> securityContext.getAuthentication())
                .filter(Authentication::isAuthenticated)
                .cast(Authentication.class)
                .map(authentication -> {
                    ServerHttpRequest request = exchange.getRequest();
                    
                    if (authentication.getPrincipal() instanceof Jwt jwt) {
                        String userId = jwt.getClaimAsString("sub");
                        String email = jwt.getClaimAsString("email");
                        List<String> roles = jwt.getClaimAsStringList("roles");
                        
                        ServerHttpRequest.Builder requestBuilder = request.mutate();
                        
                        if (userId != null) {
                            requestBuilder.header("X-User-Id", userId);
                        }
                        if (email != null) {
                            requestBuilder.header("X-User-Email", email);
                        }
                        if (roles != null && !roles.isEmpty()) {
                            requestBuilder.header("X-User-Roles", String.join(",", roles));
                        }
                        
                        return exchange.mutate().request(requestBuilder.build()).build();
                    }
                    
                    return exchange;
                })
                .defaultIfEmpty(exchange)
                .flatMap(chain::filter);
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
