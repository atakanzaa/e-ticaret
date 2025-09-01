package com.order_payment_service.repository;

import com.order_payment_service.entity.WebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WebhookEventRepository extends JpaRepository<WebhookEvent, UUID> {

    List<WebhookEvent> findByProcessedAtIsNull();

    boolean existsByProviderAndEventTypeAndPaymentId(String provider, String eventType, String paymentId);
}
