package com.catalog_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "store_id", nullable = false)
    private UUID storeId;
    
    @Column(name = "name", nullable = false, length = 200, columnDefinition = "VARCHAR(200)")
    private String name;
    
    @Column(nullable = false, length = 200, unique = true)
    private String slug;
    
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false, columnDefinition = "CHAR(3)")
    private String currency;
    
    @Column(nullable = false)
    private Integer stock;
    
    @Column(name = "category_id", nullable = false)
    private UUID categoryId;
    
    @Column(name = "rating_avg", nullable = false, precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal ratingAvg = BigDecimal.ZERO;
    
    @Column(name = "rating_count", nullable = false)
    @Builder.Default
    private Integer ratingCount = 0;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
    
    // Helper methods for backward compatibility
    public double getPriceAsDouble() {
        return price != null ? price.doubleValue() : 0.0;
    }
    
    public void setPriceAsDouble(double price) {
        this.price = BigDecimal.valueOf(price);
    }
    
    public String getImage() {
        return imageUrl;
    }
    
    public void setImage(String image) {
        this.imageUrl = image;
    }
    
    public boolean isActive() {
        return isActive != null ? isActive : true;
    }
    
    public void setActive(boolean active) {
        this.isActive = active;
    }
}
