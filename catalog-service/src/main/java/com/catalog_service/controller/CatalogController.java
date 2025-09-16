package com.catalog_service.controller;

import com.catalog_service.service.ProductService;
import com.catalog_service.service.model.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("")
public class CatalogController {

    private final ProductService productService;

    public CatalogController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/home")
    public ResponseEntity<List<Product>> home(@RequestParam(defaultValue = "24") int limit) {
        return ResponseEntity.ok(productService.home(limit));
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> products(@RequestParam(required = false) String category,
                                                  @RequestParam(required = false) String q,
                                                  @RequestParam(required = false) String min,
                                                  @RequestParam(required = false) String max,
                                                  @RequestParam(required = false) String attrs,
                                                  @RequestParam(required = false) String sort,
                                                  @RequestParam(defaultValue = "1") int page) {
        // min/max/attrs ignored in in-memory impl
        // q parametresini güvenli hale getir
        String safeQuery = (q != null && !q.isBlank()) ? q.trim() : null;
        return ResponseEntity.ok(productService.list(category, safeQuery, sort, page));
    }

    @GetMapping("/products/{slug}")
    public ResponseEntity<Product> productDetail(@PathVariable String slug) {
        return productService.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Seller endpoints (no auth in demo)
    @GetMapping("/my/store")
    public ResponseEntity<Map<String, Object>> myStore() {
        return ResponseEntity.ok(Map.of("name", "My Store", "isApproved", true));
    }

    @PostMapping("/products")
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

    @PutMapping("/products/{id}")
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

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.delete(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }

    // Admin endpoints
    @PatchMapping("/products/{id}/active")
    public ResponseEntity<Map<String, Object>> setProductActive(@PathVariable String id, @RequestBody Map<String, Object> body) {
        boolean isActive = Boolean.parseBoolean(String.valueOf(body.getOrDefault("isActive", true)));
        Product p = productService.setActive(UUID.fromString(id), isActive);
        return ResponseEntity.ok(Map.of("id", p.getId().toString(), "isActive", p.isActive()));
    }

    // Store endpoints for inter-service communication
    @GetMapping("/stores/active")
    public ResponseEntity<List<Map<String, Object>>> getActiveStores() {
        List<Product> activeProducts = productService.getAllActive();

        // Group products by storeId and create store summaries
        Map<UUID, List<Product>> productsByStore = activeProducts.stream()
                .collect(Collectors.groupingBy(Product::getStoreId));

        List<Map<String, Object>> activeStores = productsByStore.entrySet().stream()
                .map(entry -> {
                    UUID storeId = entry.getKey();
                    List<Product> products = entry.getValue();
                    long totalProducts = products.size();

                    // Get first product to extract store info (this is a simplified approach)
                    // In a real scenario, you'd have a Store entity with proper store info
                    Product firstProduct = products.get(0);

                    return Map.<String, Object>of(
                        "id", storeId.toString(),
                        "name", "Store " + storeId.toString().substring(0, 8), // Placeholder name
                        "email", "store-" + storeId.toString().substring(0, 8) + "@example.com", // Placeholder email
                        "activeSince", "2024-01-01", // Placeholder date
                        "totalProducts", totalProducts,
                        "isActive", true
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(activeStores);
    }

    @GetMapping("/stores/{storeId}")
    public ResponseEntity<Map<String, Object>> getStoreById(@PathVariable String storeId) {
        UUID storeUUID = UUID.fromString(storeId);
        List<Product> storeProducts = productService.getByStoreId(storeUUID);

        if (storeProducts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        long activeProducts = storeProducts.stream()
                .filter(Product::isActive)
                .count();

        return ResponseEntity.ok(Map.of(
            "id", storeId,
            "name", "Store " + storeId.substring(0, 8),
            "email", "store-" + storeId.substring(0, 8) + "@example.com",
            "totalProducts", storeProducts.size(),
            "activeProducts", activeProducts,
            "isActive", activeProducts > 0
        ));
    }
}


