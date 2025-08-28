package com.seller_service.controller;

import com.seller_service.service.StoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/")
public class SellerController {

    private final StoreService storeService;

    public SellerController(StoreService storeService) {
        this.storeService = storeService;
    }

    @PostMapping("/api/seller/apply")
    public ResponseEntity<Map<String, Object>> apply(@RequestHeader(value = "X-User-Id", required = false) String userId) {
        UUID uid = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
        return ResponseEntity.ok(storeService.createApplication(uid));
    }

    @GetMapping("/api/seller/me/store")
    public ResponseEntity<Map<String, Object>> myStore(@RequestHeader(value = "X-User-Id", required = false) String userId) {
        UUID uid = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
        return ResponseEntity.ok(storeService.myStore(uid));
    }

    @PutMapping("/api/seller/me/store/profile")
    public ResponseEntity<Map<String, Object>> updateStoreProfile(@RequestHeader(value = "X-User-Id", required = false) String userId,
                                                                  @RequestBody Map<String, Object> body) {
        UUID uid = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
        return ResponseEntity.ok(storeService.updateProfile(uid, body));
    }

    @GetMapping("/api/seller/applications")
    public ResponseEntity<List<Map<String, Object>>> listApplications() {
        return ResponseEntity.ok(storeService.listApplications());
    }

    @PatchMapping("/api/seller/applications/{id}")
    public ResponseEntity<Map<String, Object>> updateApplication(@PathVariable String id, @RequestBody Map<String, Object> body) {
        String status = String.valueOf(body.getOrDefault("status", "PENDING"));
        Optional<Map<String, Object>> updated = storeService.updateStatus(UUID.fromString(id), status);
        return updated.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}


