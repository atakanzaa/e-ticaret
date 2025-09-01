package com.seller_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CatalogServiceClient {

    private final RestTemplate restTemplate;

    @Value("${catalog.service.url}")
    private String catalogServiceUrl;

    public List<Map<String, Object>> getActiveStores() {
        try {
            String url = catalogServiceUrl + "/api/catalog/stores/active";
            log.info("Calling catalog service: {}", url);

            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            return response.getBody() != null ? response.getBody() : List.of();

        } catch (Exception e) {
            log.error("Failed to get active stores from catalog service", e);
            return List.of();
        }
    }

    public Map<String, Object> getStoreById(String storeId) {
        try {
            String url = catalogServiceUrl + "/api/catalog/stores/" + storeId;
            log.info("Calling catalog service: {}", url);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            return response.getBody();

        } catch (Exception e) {
            log.error("Failed to get store by id from catalog service", e);
            return Map.of();
        }
    }
}
