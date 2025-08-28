package com.catalog_service.controller;

import com.catalog_service.service.ProductService;
import com.catalog_service.service.model.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping("/")
public class CatalogController {

    private final ProductService productService;

    public CatalogController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/api/catalog/home")
    public ResponseEntity<List<Product>> home(@RequestParam(defaultValue = "24") int limit) {
        return ResponseEntity.ok(productService.home(limit));
    }

    @GetMapping("/api/catalog/products")
    public ResponseEntity<List<Product>> products(@RequestParam(required = false) String category,
                                                  @RequestParam(required = false) String q,
                                                  @RequestParam(required = false) String min,
                                                  @RequestParam(required = false) String max,
                                                  @RequestParam(required = false) String attrs,
                                                  @RequestParam(required = false) String sort,
                                                  @RequestParam(defaultValue = "1") int page) {
        // min/max/attrs ignored in in-memory impl
        return ResponseEntity.ok(productService.list(category, q, sort, page));
    }

    @GetMapping("/api/catalog/products/{slug}")
    public ResponseEntity<Product> productDetail(@PathVariable String slug) {
        return productService.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Seller endpoints (no auth in demo)
    @GetMapping("/api/catalog/my/store")
    public ResponseEntity<Map<String, Object>> myStore() {
        return ResponseEntity.ok(Map.of("name", "My Store", "isApproved", true));
    }

    @PostMapping("/api/catalog/products")
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody Map<String, Object> body) {
        String name = (String) body.getOrDefault("name", "Unnamed");
        double price = Double.parseDouble(String.valueOf(body.getOrDefault("price", 0)));
        String currency = String.valueOf(body.getOrDefault("currency", "TRY"));
        int stock = Integer.parseInt(String.valueOf(body.getOrDefault("stock", 0)));
        String categoryId = String.valueOf(body.getOrDefault("categoryId", "general"));
        String description = String.valueOf(body.getOrDefault("description", ""));
        String image = String.valueOf(body.getOrDefault("image", ""));

        Product p = productService.create(name, price, currency, stock, categoryId, description, image);
        return ResponseEntity.ok(Map.of("id", p.getId().toString(), "slug", p.getSlug()));
    }

    @PutMapping("/api/catalog/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Map<String, Object> body) {
        try {
            Product p = productService.update(UUID.fromString(id),
                    (String) body.get("name"),
                    body.get("price") == null ? null : Double.parseDouble(String.valueOf(body.get("price"))),
                    (String) body.get("currency"),
                    body.get("stock") == null ? null : Integer.parseInt(String.valueOf(body.get("stock"))),
                    (String) body.get("categoryId"),
                    (String) body.get("description"),
                    (String) body.get("image"));
            return ResponseEntity.ok(p);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/api/catalog/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.delete(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }

    // Admin endpoints
    @PatchMapping("/api/catalog/products/{id}/active")
    public ResponseEntity<Map<String, Object>> setProductActive(@PathVariable String id, @RequestBody Map<String, Object> body) {
        boolean isActive = Boolean.parseBoolean(String.valueOf(body.getOrDefault("isActive", true)));
        Product p = productService.setActive(UUID.fromString(id), isActive);
        return ResponseEntity.ok(Map.of("id", p.getId().toString(), "isActive", p.isActive()));
    }
}


