package com.catalog_service.kafka;

import com.catalog_service.entity.Product;
import com.catalog_service.entity.Category;
import com.catalog_service.repository.ProductRepository;
import com.catalog_service.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductEventConsumer {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @KafkaListener(topics = "product.events", groupId = "catalog")
    @Transactional
    public void onProductEvent(Object event) {
        try {
            log.info("[catalog] Product event received: {}", event);
            
            // Parse the event (you might want to use a proper JSON deserializer)
            if (event instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> eventMap = (java.util.Map<String, Object>) event;
                
                String eventType = (String) eventMap.get("eventType");
                UUID productId = UUID.fromString((String) eventMap.get("productId"));
                
                switch (eventType) {
                    case "PRODUCT_CREATED":
                        handleProductCreated(eventMap);
                        break;
                    case "PRODUCT_UPDATED":
                        handleProductUpdated(eventMap);
                        break;
                    case "PRODUCT_DELETED":
                        handleProductDeleted(productId);
                        break;
                    default:
                        log.warn("Unknown event type: {}", eventType);
                }
            }
        } catch (Exception e) {
            log.error("Error processing product event: {}", event, e);
        }
    }
    
    private void handleProductCreated(java.util.Map<String, Object> event) {
        try {
            UUID productId = UUID.fromString((String) event.get("productId"));
            String name = (String) event.get("name");
            String category = (String) event.get("category");
            BigDecimal price = new BigDecimal(String.valueOf(event.get("price")));
            Integer stock = Integer.valueOf(String.valueOf(event.get("quantity")));
            String description = (String) event.get("description");
            String imageUrl = (String) event.get("imageUrl");
            UUID sellerId = UUID.fromString((String) event.get("sellerId"));
            
            // Generate slug from name
            String slug = generateSlug(name);
            
            // Get or create default category
            UUID categoryId = getOrCreateDefaultCategory(category);
            
            Product product = Product.builder()
                    .id(productId)
                    .storeId(sellerId)
                    .name(name)
                    .slug(slug)
                    .price(price)
                    .currency("TRY") // Default currency
                    .stock(stock)
                    .categoryId(categoryId)
                    .description(description)
                    .imageUrl(imageUrl)
                    .isActive(true)
                    .createdAt(Instant.now())
                    .build();
            
            productRepository.save(product);
            log.info("Product created in catalog: {}", productId);
            
        } catch (Exception e) {
            log.error("Error handling product created event", e);
        }
    }
    
    private void handleProductUpdated(java.util.Map<String, Object> event) {
        try {
            UUID productId = UUID.fromString((String) event.get("productId"));
            String name = (String) event.get("name");
            String category = (String) event.get("category");
            BigDecimal price = new BigDecimal(String.valueOf(event.get("price")));
            Integer stock = Integer.valueOf(String.valueOf(event.get("quantity")));
            String description = (String) event.get("description");
            String imageUrl = (String) event.get("imageUrl");
            Boolean isActive = (Boolean) event.get("isActive");
            
            Product product = productRepository.findById(productId).orElse(null);
            if (product != null) {
                product.setName(name);
                product.setPrice(price);
                product.setStock(stock);
                product.setDescription(description);
                product.setImageUrl(imageUrl);
                product.setIsActive(isActive);
                
                // Update category if needed
                if (category != null) {
                    UUID categoryId = getOrCreateDefaultCategory(category);
                    product.setCategoryId(categoryId);
                }
                
                productRepository.save(product);
                log.info("Product updated in catalog: {}", productId);
            } else {
                log.warn("Product not found for update: {}", productId);
            }
            
        } catch (Exception e) {
            log.error("Error handling product updated event", e);
        }
    }
    
    private void handleProductDeleted(UUID productId) {
        try {
            if (productRepository.existsById(productId)) {
                productRepository.deleteById(productId);
                log.info("Product deleted from catalog: {}", productId);
            }
        } catch (Exception e) {
            log.error("Error handling product deleted event", e);
        }
    }
    
    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "") + 
                "-" + UUID.randomUUID().toString().substring(0, 8);
    }
    
    private UUID getOrCreateDefaultCategory(String categoryName) {
        try {
            // Try to find existing category
            Category existingCategory = categoryRepository.findByName(categoryName);
            if (existingCategory != null) {
                return existingCategory.getId();
            }
            
            // Create new category if not exists
            Category newCategory = Category.builder()
                    .name(categoryName)
                    .build();
            Category savedCategory = categoryRepository.save(newCategory);
            return savedCategory.getId();
            
        } catch (Exception e) {
            log.warn("Could not create category: {}, using default", categoryName, e);
            // Return default category ID if creation fails
            return UUID.fromString("11111111-1111-1111-1111-111111111111");
        }
    }
}
