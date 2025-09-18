package com.auth_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SellerServiceClient {

    @Value("${SELLER_SERVICE_URL:http://seller:8083}")
    private String sellerServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public void createApplication(UUID userId) {
        try {
            String url = sellerServiceUrl + "/api/seller/apply";
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-User-Id", userId.toString());
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<?> res = restTemplate.exchange(url, HttpMethod.POST, entity, Object.class);
            log.info("Seller application created for user {}: status {}", userId, res.getStatusCode());
        } catch (Exception e) {
            log.error("Failed to create seller application for user {}", userId, e);
        }
    }
}


