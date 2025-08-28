package com.auth_service.repository;

import com.auth_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByEmailAndIsDeletedFalse(String email);
    
    boolean existsByEmailAndIsDeletedFalse(String email);
    
    @Query("SELECT u FROM User u WHERE u.isDeleted = false AND u.id = :id")
    Optional<User> findActiveById(@Param("id") UUID id);
    
    @Query("SELECT u FROM User u WHERE u.isDeleted = false ORDER BY u.createdAt DESC")
    org.springframework.data.domain.Page<User> findAllActive(org.springframework.data.domain.Pageable pageable);
    
    @Query(value = "SELECT * FROM users u WHERE u.is_deleted = false AND :role = ANY(u.roles) ORDER BY u.created_at DESC",
           countQuery = "SELECT count(*) FROM users u WHERE u.is_deleted = false AND :role = ANY(u.roles)",
           nativeQuery = true)
    org.springframework.data.domain.Page<User> findByRole(@Param("role") String role, org.springframework.data.domain.Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.isDeleted = false AND (LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    org.springframework.data.domain.Page<User> searchUsers(@Param("query") String query, org.springframework.data.domain.Pageable pageable);
    
    @Modifying
    @Query("UPDATE User u SET u.isDeleted = true, u.email = CONCAT('deleted_', u.id, '@deleted.com'), u.name = 'Deleted User' WHERE u.id = :id")
    void softDeleteAndAnonymize(@Param("id") UUID id);
}
