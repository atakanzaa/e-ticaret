package com.order_payment_service.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.order_payment_service.config.IyzicoConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Slf4j
@Component
@RequiredArgsConstructor
public class IyzicoClient {

    private final IyzicoConfig iyzicoConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String ALGORITHM = "HmacSHA256";

    public <T, R> R post(String endpoint, T request, Class<R> responseClass) throws JsonProcessingException {
        String url = iyzicoConfig.getApi().getBaseUrl() + endpoint;
        String requestBody = objectMapper.writeValueAsString(request);

        HttpHeaders headers = createHeaders(requestBody, url);
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        log.info("Calling iyzico API: {} with body: {}", url, requestBody);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        log.info("Iyzico response status: {}, body: {}", response.getStatusCode(), response.getBody());

        return objectMapper.readValue(response.getBody(), responseClass);
    }

    public String generateAuthorizationHeader(String dataToEncrypt) {
        try {
            String apiKey = iyzicoConfig.getApi().getKey();
            String secretKey = iyzicoConfig.getApi().getSecret();
            String randomString = String.valueOf(System.currentTimeMillis());

            Mac mac = Mac.getInstance(ALGORITHM);
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), ALGORITHM);
            mac.init(secretKeySpec);

            String data = apiKey + randomString + secretKey + dataToEncrypt;
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Failed to generate authorization header", e);
        }
    }

    private HttpHeaders createHeaders(String requestBody, String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", generateAuthorizationHeader(requestBody));
        headers.set("x-iyzi-rnd", String.valueOf(System.currentTimeMillis()));
        return headers;
    }

    public boolean validateSignature(String payload, String signature) {
        try {
            Mac mac = Mac.getInstance(ALGORITHM);
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                iyzicoConfig.getApi().getSecret().getBytes(StandardCharsets.UTF_8), ALGORITHM);
            mac.init(secretKeySpec);

            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String expectedSignature = Base64.getEncoder().encodeToString(hash);

            return expectedSignature.equals(signature);
        } catch (Exception e) {
            log.error("Failed to validate signature", e);
            return false;
        }
    }
}
