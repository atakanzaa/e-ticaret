package com.catalog_service.service.impl;

import com.catalog_service.entity.Product;
import com.catalog_service.repository.ProductRepository;
import com.catalog_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class JpaProductService implements ProductService {
    
    private final ProductRepository productRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<com.catalog_service.service.model.Product> home(int limit) {
        List<Product> products = productRepository.findHomeProducts(PageRequest.of(0, limit));
        return products.stream().map(this::convertToModel).toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<com.catalog_service.service.model.Product> list(String category, String q, String sort, int page) {
        UUID categoryId = null;
        if (category != null && !category.isBlank() && !category.equals("all")) {
            try {
                categoryId = UUID.fromString(category);
            } catch (IllegalArgumentException e) {
                // If category is not UUID, ignore it for now
            }
        }
        
        List<Product> products = productRepository.findProductsWithFilters(categoryId, q);
        
        // Apply sorting (simplified)
        if ("price,asc".equals(sort)) {
            products = products.stream()
                    .sorted((a, b) -> a.getPrice().compareTo(b.getPrice()))
                    .toList();
        } else if ("price,desc".equals(sort)) {
            products = products.stream()
                    .sorted((a, b) -> b.getPrice().compareTo(a.getPrice()))
                    .toList();
        }
        
        return products.stream().map(this::convertToModel).toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<com.catalog_service.service.model.Product> findBySlug(String slug) {
        return productRepository.findBySlug(slug).map(this::convertToModel);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<com.catalog_service.service.model.Product> findById(UUID id) {
        return productRepository.findById(id).map(this::convertToModel);
    }
    
    @Override
    @Transactional
    public com.catalog_service.service.model.Product create(String name, double price, String currency, int stock, String categoryId, String description, String image) {
        UUID categoryUuid;
        try {
            categoryUuid = UUID.fromString(categoryId);
        } catch (IllegalArgumentException e) {
            // Default category if invalid UUID
            categoryUuid = UUID.fromString("11111111-1111-1111-1111-111111111111");
        }
        
        String slug = generateSlug(name);
        
        Product product = Product.builder()
                .storeId(UUID.randomUUID()) // Default store for now
                .name(name)
                .slug(slug)
                .price(BigDecimal.valueOf(price))
                .currency(currency)
                .stock(stock)
                .categoryId(categoryUuid)
                .description(description)
                .imageUrl(image)
                .isActive(true)
                .build();
        
        Product saved = productRepository.save(product);
        log.info("Created product: {} with ID: {}", saved.getName(), saved.getId());
        
        return convertToModel(saved);
    }
    
    @Override
    @Transactional
    public com.catalog_service.service.model.Product update(UUID id, String name, Double price, String currency, Integer stock, String categoryId, String description, String image) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (name != null) product.setName(name);
        if (price != null) product.setPrice(BigDecimal.valueOf(price));
        if (currency != null) product.setCurrency(currency);
        if (stock != null) product.setStock(stock);
        if (categoryId != null) {
            try {
                product.setCategoryId(UUID.fromString(categoryId));
            } catch (IllegalArgumentException e) {
                // Keep existing category if invalid
            }
        }
        if (description != null) product.setDescription(description);
        if (image != null) product.setImageUrl(image);
        
        Product saved = productRepository.save(product);
        log.info("Updated product: {}", saved.getId());
        
        return convertToModel(saved);
    }
    
    @Override
    @Transactional
    public void delete(UUID id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            log.info("Deleted product: {}", id);
        }
    }
    
    @Override
    @Transactional
    public com.catalog_service.service.model.Product setActive(UUID id, boolean isActive) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setIsActive(isActive);
        Product saved = productRepository.save(product);
        log.info("Set product {} active status to: {}", id, isActive);
        
        return convertToModel(saved);
    }
    
    private String generateSlug(String name) {
        String base = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("(^-|-$)", "");
        
        return base + "-" + UUID.randomUUID().toString().substring(0, 8);
    }
    
    private com.catalog_service.service.model.Product convertToModel(Product entity) {
        com.catalog_service.service.model.Product model = new com.catalog_service.service.model.Product();
        model.setId(entity.getId());
        model.setStoreId(entity.getStoreId());
        model.setName(entity.getName());
        model.setSlug(entity.getSlug());
        model.setPrice(entity.getPriceAsDouble());
        model.setCurrency(entity.getCurrency());
        model.setStock(entity.getStock());
        model.setCategoryId(entity.getCategoryId().toString());
        model.setCategoryName("General"); // TODO: Join with categories table
        model.setRatingAvg(entity.getRatingAvg().doubleValue());
        model.setRatingCount(entity.getRatingCount());
        model.setActive(entity.isActive());
        model.setImage(entity.getImageUrl());
        model.setDescription(entity.getDescription());
        model.setCreatedAt(entity.getCreatedAt());
        return model;
    }

    @Override
    @Transactional
    public boolean decrementStock(UUID productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < quantity) {
            log.warn("Insufficient stock for product {}: requested {}, available {}",
                    productId, quantity, product.getStock());
            return false;
        }

        product.setStock(product.getStock() - quantity);
        Product saved = productRepository.save(product);
        log.info("Decremented stock for product {} by {} units. New stock: {}",
                productId, quantity, saved.getStock());

        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<com.catalog_service.service.model.Product> getAllActive() {
        java.util.List<Product> products = productRepository.findByIsActiveTrue();
        return products.stream()
                .map(this::convertToModel)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<com.catalog_service.service.model.Product> getByStoreId(UUID storeId) {
        java.util.List<Product> products = productRepository.findAll().stream()
                .filter(product -> product.getStoreId().equals(storeId))
                .collect(java.util.stream.Collectors.toList());
        return products.stream()
                .map(this::convertToModel)
                .collect(java.util.stream.Collectors.toList());
    }
}
