package com.seller_service.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateProductRequest {
    
    @Size(min = 2, max = 255, message = "Product name must be between 2 and 255 characters")
    private String name;
    
    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;
    
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Price must have at most 8 digits before decimal and 2 after")
    private BigDecimal price;
    
    @Min(value = 0, message = "Quantity must be non-negative")
    @Max(value = 999999, message = "Quantity must not exceed 999,999")
    private Integer quantity;
    
    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;
    
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;
    
    private Boolean isActive;
}
