package com.auth_service.service;

import com.auth_service.config.GoogleOAuthProperties;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Service
@Slf4j
@RequiredArgsConstructor
@ConditionalOnProperty(name = "google.oauth.client-id")
public class GoogleAuthService {

    private final GoogleOAuthProperties googleOAuthProperties;
    private GoogleIdTokenVerifier verifier;

    @PostConstruct
    public void init() {
        if (googleOAuthProperties.getClientId() != null && !googleOAuthProperties.getClientId().isEmpty()) {
            this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleOAuthProperties.getClientId()))
                    .build();
            log.info("Google Auth Service initialized with client ID: {}", 
                    googleOAuthProperties.getClientId().substring(0, 10) + "...");
        } else {
            log.warn("Google OAuth is not configured - GOOGLE_CLIENT_ID is missing");
        }
    }

    public GoogleIdToken.Payload verifyIdToken(String idTokenString) {
        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                
                // Verify the issuer
                if (!"accounts.google.com".equals(payload.getIssuer()) && 
                    !"https://accounts.google.com".equals(payload.getIssuer())) {
                    log.error("Invalid issuer: {}", payload.getIssuer());
                    return null;
                }
                
                // Verify the audience
                if (!googleOAuthProperties.getClientId().equals(payload.getAudience())) {
                    log.error("Invalid audience: {}", payload.getAudience());
                    return null;
                }
                
                log.info("Google ID token verified successfully for user: {}", payload.getEmail());
                return payload;
            } else {
                log.error("Invalid Google ID token");
                return null;
            }
        } catch (GeneralSecurityException | IOException e) {
            log.error("Error verifying Google ID token", e);
            return null;
        }
    }
}
