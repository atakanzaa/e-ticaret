package com.seller_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/")
public class SellerController {

    @PostMapping("/api/seller/apply")
    public ResponseEntity<Map<String, Object>> apply() {
        // TODO: create seller application for current user
        return ResponseEntity.ok(Map.of("status", "PENDING"));
    }

    @GetMapping("/api/seller/me/store")
    public ResponseEntity<Map<String, Object>> myStore() {
        // TODO: return store info for current seller
        return ResponseEntity.ok(Map.of());
    }

    @PutMapping("/api/seller/me/store/profile")
    public ResponseEntity<Map<String, Object>> updateStoreProfile(@RequestBody Map<String, Object> body) {
        // TODO: update store profile
        return ResponseEntity.ok(Map.of("updated", true));
    }

    @GetMapping("/api/seller/applications")
    public ResponseEntity<List<Map<String, Object>>> listApplications() {
        // TODO: admin list
        return ResponseEntity.ok(List.of());
    }

    @PatchMapping("/api/seller/applications/{id}")
    public ResponseEntity<Map<String, Object>> updateApplication(@PathVariable String id, @RequestBody Map<String, Object> body) {
        // TODO: admin approve/reject
        return ResponseEntity.ok(Map.of("id", id, "status", body.getOrDefault("status", "PENDING")));
    }
}


