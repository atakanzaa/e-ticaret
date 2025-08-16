package com.auth_service.controller;

import com.auth_service.dto.*;
import com.auth_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Register request for email: {}", request.getEmail());
        AuthResponse response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request for email: {}", request.getEmail());
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@RequestHeader("X-User-Id") String userId) {
        log.info("Get current user: {}", userId);
        UserResponse response = userService.getUserById(UUID.fromString(userId));
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
        // TODO: Implement proper JWKS endpoint for JWT validation
        // This is a placeholder for development
        Map<String, Object> jwks = Map.of(
                "keys", List.of()
        );
        return ResponseEntity.ok(jwks);
    }
    
    // TODO: Implement OAuth2 callback endpoints
    @GetMapping("/oauth2/callback/google")
    public ResponseEntity<AuthResponse> googleCallback(@RequestParam String code) {
        log.info("Google OAuth2 callback");
        // TODO: Implement Google OAuth2 flow
        throw new UnsupportedOperationException("Google OAuth2 not implemented yet");
    }
}