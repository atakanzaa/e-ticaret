package com.seller_service.controller;

import com.seller_service.dto.CreateProductRequest;
import com.seller_service.dto.ProductResponse;
import com.seller_service.dto.UpdateProductRequest;
import com.seller_service.service.CatalogServiceClient;
import com.seller_service.service.ProductService;
import com.seller_service.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class SellerController {

    private final StoreService storeService;
    private final ProductService productService;
    private final CatalogServiceClient catalogServiceClient;

    // Store management endpoints
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

    // Product management endpoints
    @PostMapping("/api/seller/products")
    public ResponseEntity<ProductResponse> createProduct(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @Valid @RequestBody CreateProductRequest request) {
        
        UUID sellerId = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
        log.info("Creating product for seller: {}", sellerId);
        
        try {
            ProductResponse product = productService.createProduct(sellerId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(product);
        } catch (Exception e) {
            log.error("Error creating product for seller {}: {}", sellerId, e.getMessage());
            throw new RuntimeException("Failed to create product: " + e.getMessage());
        }
    }

    @GetMapping("/api/seller/products")
    public ResponseEntity<List<ProductResponse>> getMyProducts(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        UUID sellerId = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
        log.info("Getting products for seller: {}", sellerId);
        
        try {
            if (page >= 0 && size > 0) {
                Pageable pageable = PageRequest.of(page, size);
                Page<ProductResponse> products = productService.getProductsBySellerPaged(sellerId, pageable);
                return ResponseEntity.ok(products.getContent());
            } else {
                List<ProductResponse> products = productService.getProductsBySeller(sellerId);
                return ResponseEntity.ok(products);
            }
        } catch (Exception e) {
            log.error("Error getting products for seller {}: {}", sellerId, e.getMessage());
            throw new RuntimeException("Failed to get products: " + e.getMessage());
        }
    }

    @GetMapping("/api/seller/products/{id}")
    public ResponseEntity<ProductResponse> getProduct(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable UUID id) {
        
        UUID sellerId = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
        log.info("Getting product {} for seller: {}", id, sellerId);
        
        try {
            ProductResponse product = productService.getProduct(sellerId, id);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            log.error("Product not found or not owned by seller {}: {}", sellerId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/api/seller/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProductRequest request) {
        
        UUID sellerId = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
        log.info("Updating product {} for seller: {}", id, sellerId);
        
        try {
            ProductResponse product = productService.updateProduct(sellerId, id, request);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            log.error("Error updating product {} for seller {}: {}", id, sellerId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/api/seller/products/{id}")
    public ResponseEntity<Void> deleteProduct(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @PathVariable UUID id) {
        
        UUID sellerId = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
        log.info("Deleting product {} for seller: {}", id, sellerId);
        
        try {
            productService.deleteProduct(sellerId, id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error deleting product {} for seller {}: {}", id, sellerId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/api/seller/stats")
    public ResponseEntity<Map<String, Object>> getSellerStats(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        UUID sellerId = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
        log.info("Getting stats for seller: {}", sellerId);

        try {
            long activeProductCount = productService.getActiveProductCount(sellerId);
            Map<String, Object> stats = Map.of(
                "activeProducts", activeProductCount,
                "sellerId", sellerId
            );
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error getting stats for seller {}: {}", sellerId, e.getMessage());
            throw new RuntimeException("Failed to get seller stats: " + e.getMessage());
        }
    }

    @GetMapping("/api/sellers/active")
    public ResponseEntity<List<Map<String, Object>>> getActiveSellers() {
        log.info("Getting active sellers list");

        try {
            // Get active stores from catalog service
            List<Map<String, Object>> activeSellers = getActiveStoresFromCatalog();
            return ResponseEntity.ok(activeSellers);
        } catch (Exception e) {
            log.error("Error getting active sellers: {}", e.getMessage());
            // Fallback to empty list instead of throwing exception
            return ResponseEntity.ok(List.of());
        }
    }

    private List<Map<String, Object>> getActiveStoresFromCatalog() {
        return catalogServiceClient.getActiveStores();
    }
}


