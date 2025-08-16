package com.review_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/")
public class ReviewController {

    @PostMapping("/api/review")
    public ResponseEntity<Map<String, Object>> addReview(@RequestBody Map<String, Object> body) {
        // TODO: persist to db and emit event for moderation flow
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/api/review/product/{productId}")
    public ResponseEntity<List<Map<String, Object>>> reviews(@PathVariable String productId, @RequestParam(defaultValue = "0") int page) {
        // TODO: fetch approved reviews
        return ResponseEntity.ok(List.of());
    }

    @PatchMapping("/api/review/{id}/approve")
    public ResponseEntity<Map<String, Object>> approve(@PathVariable String id, @RequestBody Map<String, Object> body) {
        // TODO: set approved and emit review.approved event
        return ResponseEntity.ok(Map.of("approved", body.getOrDefault("isApproved", false)));
    }
}


