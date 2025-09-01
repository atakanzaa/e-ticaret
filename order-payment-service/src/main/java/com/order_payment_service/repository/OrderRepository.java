package com.order_payment_service.repository;

import com.order_payment_service.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'PAID' AND o.createdAt >= :startDate AND o.createdAt < :endDate")
    BigDecimal getTotalRevenueBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate AND o.createdAt < :endDate")
    Long countOrdersBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("SELECT o FROM Order o WHERE o.createdAt >= :startDate AND o.createdAt < :endDate ORDER BY o.createdAt DESC")
    List<Order> findOrdersBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
}
