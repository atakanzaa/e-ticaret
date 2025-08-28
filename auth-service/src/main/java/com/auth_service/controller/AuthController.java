package com.auth_service.controller;

import com.auth_service.dto.*;
import com.auth_service.security.RsaKeyProvider;
import com.auth_service.service.GoogleAuthService;
import com.auth_service.service.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import java.util.Optional;
import com.nimbusds.jwt.SignedJWT;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigInteger;
import java.security.interfaces.RSAPublicKey;
import java.text.ParseException;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    private final RsaKeyProvider rsaKeyProvider;
    private final Optional<GoogleAuthService> googleAuthService;

    @Value("${GOOGLE_CLIENT_ID:}")
    private String googleClientId;
    @Value("${GOOGLE_CLIENT_SECRET:}")
    private String googleClientSecret;
    @Value("${GOOGLE_REDIRECT_URI:}")
    private String googleRedirectUri;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Register request for email: {}", request.getEmail());
        try {
            AuthResponse response = userService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (com.auth_service.service.UserServiceException e) {
            if (e.getStatus() == 409) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request for email: {}", request.getEmail());
        try {
            AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (com.auth_service.service.UserServiceException e) {
            if (e.getStatus() == 401) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@RequestHeader("X-User-Id") String userId) {
        log.info("Get current user: {}", userId);
        UserResponse response = userService.getUserById(UUID.fromString(userId));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/password")
    public ResponseEntity<Void> changePassword(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody PasswordChangeRequest request
    ) {
        userService.changePassword(UUID.fromString(userId), request.getNewPassword());
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@Valid @RequestBody GoogleAuthRequest request) {
        log.info("Google authentication request - isRegistration: {}", request.isRegistration());
        
        if (googleAuthService.isEmpty()) {
            log.error("Google OAuth is not configured");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
        
        GoogleIdToken.Payload payload = googleAuthService.get().verifyIdToken(request.getIdToken());
        if (payload == null) {
            log.error("Invalid Google ID token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        if (name == null || name.isBlank()) {
            String givenName = (String) payload.get("given_name");
            String familyName = (String) payload.get("family_name");
            name = String.join(" ", 
                givenName != null ? givenName : "", 
                familyName != null ? familyName : ""
            ).trim();
            if (name.isBlank()) {
                name = email;
            }
        }
        
        AuthResponse response = userService.loginOrRegisterOauth(email, name);
        return ResponseEntity.ok(response);
    }
    
    // Admin endpoints
    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String q,
            Pageable pageable) {
        log.info("Get users - role: {}, query: {}", role, q);
        Page<UserResponse> users = userService.getUsers(role, q, pageable);
        return ResponseEntity.ok(users);
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        log.info("Delete user: {}", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/users/{id}/roles")
    public ResponseEntity<Void> updateUserRoles(
            @PathVariable UUID id,
            @RequestBody Map<String, List<String>> request) {
        log.info("Update user roles - userId: {}, roles: {}", id, request.get("roles"));
        userService.updateUserRoles(id, request.get("roles"));
        return ResponseEntity.noContent().build();
    }
    
    // JWKS endpoint for gateway - simplified for development
    @GetMapping("/.well-known/jwks.json")
    public ResponseEntity<Map<String, Object>> getJwks() {
        RSAPublicKey publicKey = rsaKeyProvider.getPublicKey();
        String kid = rsaKeyProvider.getKeyId();

        String n = base64UrlUnsigned(publicKey.getModulus());
        String e = base64UrlUnsigned(publicKey.getPublicExponent());

        Map<String, Object> jwk = Map.of(
                "kty", "RSA",
                "kid", kid,
                "alg", "RS256",
                "use", "sig",
                "n", n,
                "e", e
        );
        return ResponseEntity.ok(Map.of("keys", List.of(jwk)));
    }
    
    @GetMapping("/oauth2/callback/google")
    public ResponseEntity<AuthResponse> googleCallback(@RequestParam String code) {
        log.info("Google OAuth2 callback with code: {}", code);

        if (googleClientId == null || googleClientId.isBlank() ||
                googleClientSecret == null || googleClientSecret.isBlank() ||
                googleRedirectUri == null || googleRedirectUri.isBlank()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("code", code);
        form.add("client_id", googleClientId);
        form.add("client_secret", googleClientSecret);
        form.add("redirect_uri", googleRedirectUri);
        form.add("grant_type", "authorization_code");

        Map<String, Object> tokenResponse = restTemplate.postForObject(
                "https://oauth2.googleapis.com/token",
                form,
                Map.class
        );

        if (tokenResponse == null || !tokenResponse.containsKey("id_token")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String idToken = (String) tokenResponse.get("id_token");
        try {
            SignedJWT jwt = SignedJWT.parse(idToken);
            String email = jwt.getJWTClaimsSet().getStringClaim("email");
            String name = jwt.getJWTClaimsSet().getStringClaim("name");
            if ((name == null || name.isBlank())) {
                String given = jwt.getJWTClaimsSet().getStringClaim("given_name");
                String family = jwt.getJWTClaimsSet().getStringClaim("family_name");
                name = String.join(" ", List.of(given == null ? "" : given, family == null ? "" : family)).trim();
            }

            if (email == null || email.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            AuthResponse response = userService.loginOrRegisterOauth(email, name == null ? email : name);
            return ResponseEntity.ok(response);
        } catch (ParseException e) {
            log.error("Failed to parse Google ID token", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    private static String base64UrlUnsigned(BigInteger bigInteger) {
        byte[] bytes = bigInteger.toByteArray();
        // Remove leading sign byte if present
        if (bytes.length > 1 && bytes[0] == 0) {
            byte[] tmp = new byte[bytes.length - 1];
            System.arraycopy(bytes, 1, tmp, 0, tmp.length);
            bytes = tmp;
        }
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}