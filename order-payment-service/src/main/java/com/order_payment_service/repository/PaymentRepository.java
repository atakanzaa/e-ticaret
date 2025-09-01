package com.order_payment_service.repository;

import com.order_payment_service.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByOrderId(UUID orderId);

    Optional<Payment> findByConversationId(String conversationId);

    Optional<Payment> findByIyzPaymentId(String iyzPaymentId);
}
