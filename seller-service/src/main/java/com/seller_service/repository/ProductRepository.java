package com.seller_service.repository;

import com.seller_service.entity.Product;
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
    
    List<Product> findBySellerIdOrderByCreatedAtDesc(UUID sellerId);
    
    Page<Product> findBySellerIdOrderByCreatedAtDesc(UUID sellerId, Pageable pageable);
    
    List<Product> findBySellerIdAndIsActiveTrueOrderByCreatedAtDesc(UUID sellerId);
    
    Optional<Product> findByIdAndSellerId(UUID id, UUID sellerId);
    
    @Query("SELECT p FROM Product p WHERE p.sellerId = :sellerId AND p.name LIKE %:name%")
    List<Product> findBySellerIdAndNameContaining(@Param("sellerId") UUID sellerId, @Param("name") String name);
    
    long countBySellerIdAndIsActiveTrue(UUID sellerId);
    
    boolean existsByIdAndSellerId(UUID id, UUID sellerId);
}
