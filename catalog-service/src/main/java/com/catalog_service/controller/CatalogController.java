package com.catalog_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/")
public class CatalogController {

    @GetMapping("/api/catalog/home")
    public ResponseEntity<List<Map<String, Object>>> home(@RequestParam(defaultValue = "24") int limit) {
        // TODO: return random products, cached 60s
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/api/catalog/products")
    public ResponseEntity<List<Map<String, Object>>> products(@RequestParam(required = false) String category,
                                                              @RequestParam(required = false) String q,
                                                              @RequestParam(required = false) String min,
                                                              @RequestParam(required = false) String max,
                                                              @RequestParam(required = false) String attrs,
                                                              @RequestParam(required = false) String sort,
                                                              @RequestParam(defaultValue = "1") int page) {
        // TODO: filter & paginate
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/api/catalog/products/{slug}")
    public ResponseEntity<Map<String, Object>> productDetail(@PathVariable String slug) {
        // TODO: product detail by slug
        return ResponseEntity.ok(Map.of("slug", slug));
    }

    @GetMapping("/api/catalog/stores/{slug}")
    public ResponseEntity<Map<String, Object>> storeDetail(@PathVariable String slug) {
        // TODO: store by slug
        return ResponseEntity.ok(Map.of("slug", slug));
    }

    // Seller endpoints
    @GetMapping("/api/catalog/my/store")
    public ResponseEntity<Map<String, Object>> myStore() {
        // TODO: require SELLER
        return ResponseEntity.ok(Map.of());
    }

    @PostMapping("/api/catalog/products")
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody Map<String, Object> body) {
        // TODO: create product & emit product.updated
        return ResponseEntity.ok(Map.of("id", "TODO", "slug", "todo"));
    }

    @PostMapping("/api/catalog/products/{id}/images/presign")
    public ResponseEntity<List<String>> presign(@PathVariable String id, @RequestBody Map<String, Integer> body) {
        // TODO: return presigned URLs with MinIO
        return ResponseEntity.ok(List.of());
    }

    // Admin endpoints
    @PatchMapping("/api/catalog/stores/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveStore(@PathVariable String id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("id", id, "isApproved", body.get("isApproved")));
    }

    @PatchMapping("/api/catalog/products/{id}/active")
    public ResponseEntity<Map<String, Object>> setProductActive(@PathVariable String id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("id", id, "isActive", body.get("isActive")));
    }
}


