package com.catalog_service.repository;

import com.catalog_service.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    List<Product> findByIsActiveTrueOrderByCreatedAtDesc();
    
    Page<Product> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);
    
    Optional<Product> findBySlug(String slug);
    
    List<Product> findByStoreIdOrderByCreatedAtDesc(UUID storeId);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true " +
           "AND (:category IS NULL OR p.categoryId = :category)")
    List<Product> findProductsWithFilters(@Param("category") UUID category);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.createdAt DESC")
    List<Product> findHomeProducts(Pageable pageable);
}
