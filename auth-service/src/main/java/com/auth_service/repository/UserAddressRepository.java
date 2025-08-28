package com.auth_service.repository;

import com.auth_service.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, UUID> {

    @Query("SELECT a FROM UserAddress a WHERE a.isDeleted = false AND a.user.id = :userId ORDER BY a.isDefault DESC, a.createdAt DESC")
    List<UserAddress> findActiveByUserId(@Param("userId") UUID userId);

    @Query("SELECT a FROM UserAddress a WHERE a.isDeleted = false AND a.user.id = :userId AND a.id = :id")
    Optional<UserAddress> findActiveByUserIdAndId(@Param("userId") UUID userId, @Param("id") UUID id);

    @Modifying
    @Query("UPDATE UserAddress a SET a.isDeleted = true WHERE a.user.id = :userId AND a.id = :id")
    void softDelete(@Param("userId") UUID userId, @Param("id") UUID id);

    @Modifying
    @Query("UPDATE UserAddress a SET a.isDefault = false WHERE a.user.id = :userId")
    void clearDefaults(@Param("userId") UUID userId);
}


