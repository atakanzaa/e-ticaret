package com.seller_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceClient {

    @Value("${AUTH_SERVICE_URL:http://auth:8081}")
    private String authServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public void setUserSellerRole(UUID userId) {
        try {
            String url = authServiceUrl + "/users/" + userId + "/roles";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            // Grant USER and SELLER
            Map<String, Object> body = Map.of("roles", new String[]{"USER", "SELLER"});
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Void> res = restTemplate.exchange(url, HttpMethod.PATCH, entity, Void.class);
            log.info("Updated roles for user {}: status {}", userId, res.getStatusCode());
        } catch (Exception e) {
            log.error("Failed to update roles for user {} via auth-service", userId, e);
        }
    }
}


