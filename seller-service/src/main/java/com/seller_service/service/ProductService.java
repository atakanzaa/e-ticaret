package com.seller_service.service;

import com.seller_service.dto.CreateProductRequest;
import com.seller_service.dto.ProductResponse;
import com.seller_service.dto.UpdateProductRequest;
import com.seller_service.entity.Product;
import com.seller_service.event.ProductEvent;
import com.seller_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final ProductEventPublisher eventPublisher;
    
    @Transactional
    public ProductResponse createProduct(UUID sellerId, CreateProductRequest request) {
        log.info("Creating product for seller: {}", sellerId);
        
        Product product = Product.builder()
                .name(request.getName())
                .category(request.getCategory())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .imageUrl(request.getImageUrl())
                .description(request.getDescription())
                .sellerId(sellerId)
                .isActive(true)
                .build();
        
        Product savedProduct = productRepository.save(product);
        log.info("Product created with ID: {}", savedProduct.getId());
        
        // Publish product created event
        ProductEvent event = new ProductEvent(
                ProductEvent.EventType.PRODUCT_CREATED,
                savedProduct.getId(),
                savedProduct.getName(),
                savedProduct.getCategory(),
                savedProduct.getPrice(),
                savedProduct.getQuantity(),
                savedProduct.getImageUrl(),
                savedProduct.getDescription(),
                savedProduct.getSellerId(),
                savedProduct.getIsActive(),
                savedProduct.getCreatedAt(),
                savedProduct.getUpdatedAt()
        );
        eventPublisher.publishProductCreated(event);
        
        return mapToResponse(savedProduct);
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsBySeller(UUID sellerId) {
        log.info("Getting products for seller: {}", sellerId);
        
        List<Product> products = productRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);
        return products.stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsBySellerPaged(UUID sellerId, Pageable pageable) {
        log.info("Getting paged products for seller: {}", sellerId);
        
        Page<Product> products = productRepository.findBySellerIdOrderByCreatedAtDesc(sellerId, pageable);
        return products.map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public ProductResponse getProduct(UUID sellerId, UUID productId) {
        log.info("Getting product {} for seller: {}", productId, sellerId);
        
        Product product = productRepository.findByIdAndSellerId(productId, sellerId)
                .orElseThrow(() -> new RuntimeException("Product not found or not owned by seller"));
        
        return mapToResponse(product);
    }
    
    @Transactional
    public ProductResponse updateProduct(UUID sellerId, UUID productId, UpdateProductRequest request) {
        log.info("Updating product {} for seller: {}", productId, sellerId);
        
        Product product = productRepository.findByIdAndSellerId(productId, sellerId)
                .orElseThrow(() -> new RuntimeException("Product not found or not owned by seller"));
        
        // Update only non-null fields
        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getCategory() != null) {
            product.setCategory(request.getCategory());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getQuantity() != null) {
            product.setQuantity(request.getQuantity());
        }
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getIsActive() != null) {
            product.setIsActive(request.getIsActive());
        }
        
        Product savedProduct = productRepository.save(product);
        log.info("Product updated: {}", savedProduct.getId());
        
        // Publish product updated event
        ProductEvent event = new ProductEvent(
                ProductEvent.EventType.PRODUCT_UPDATED,
                savedProduct.getId(),
                savedProduct.getName(),
                savedProduct.getCategory(),
                savedProduct.getPrice(),
                savedProduct.getQuantity(),
                savedProduct.getImageUrl(),
                savedProduct.getDescription(),
                savedProduct.getSellerId(),
                savedProduct.getIsActive(),
                savedProduct.getCreatedAt(),
                savedProduct.getUpdatedAt()
        );
        eventPublisher.publishProductUpdated(event);
        
        return mapToResponse(savedProduct);
    }
    
    @Transactional
    public void deleteProduct(UUID sellerId, UUID productId) {
        log.info("Deleting product {} for seller: {}", productId, sellerId);
        
        Product product = productRepository.findByIdAndSellerId(productId, sellerId)
                .orElseThrow(() -> new RuntimeException("Product not found or not owned by seller"));
        
        // Publish product deleted event before deletion
        ProductEvent event = new ProductEvent(
                ProductEvent.EventType.PRODUCT_DELETED,
                product.getId(),
                product.getName(),
                product.getCategory(),
                product.getPrice(),
                product.getQuantity(),
                product.getImageUrl(),
                product.getDescription(),
                product.getSellerId(),
                product.getIsActive(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
        eventPublisher.publishProductDeleted(event);
        
        productRepository.deleteById(productId);
        log.info("Product deleted: {}", productId);
    }
    
    @Transactional(readOnly = true)
    public long getActiveProductCount(UUID sellerId) {
        return productRepository.countBySellerIdAndIsActiveTrue(sellerId);
    }
    
    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .imageUrl(product.getImageUrl())
                .sellerId(product.getSellerId())
                .description(product.getDescription())
                .isActive(product.getIsActive())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
