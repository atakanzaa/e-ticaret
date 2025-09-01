package com.catalog_service.kafka;

import com.catalog_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class CatalogKafkaConsumer {

    private final ProductService productService;

    @KafkaListener(topics = "payment.succeeded", groupId = "catalog")
    @Transactional
    public void onPaymentSucceeded(Map<String, Object> e) {
        log.info("[catalog] payment.succeeded received: {}", e);

        try {
            // Extract order items from the event
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> orderItems = (List<Map<String, Object>>) e.get("orderItems");

            if (orderItems == null || orderItems.isEmpty()) {
                log.warn("[catalog] No order items found in payment.succeeded event");
                return;
            }

            // Process each order item
            for (Map<String, Object> item : orderItems) {
                String productIdStr = (String) item.get("productId");
                Integer quantity = (Integer) item.get("quantity");

                if (productIdStr == null || quantity == null) {
                    log.warn("[catalog] Invalid order item data: productId={}, quantity={}", productIdStr, quantity);
                    continue;
                }

                try {
                    UUID productId = UUID.fromString(productIdStr);
                    boolean success = productService.decrementStock(productId, quantity);

                    if (success) {
                        log.info("[catalog] Successfully decremented stock for product {} by {} units",
                                productId, quantity);
                    } else {
                        log.error("[catalog] Failed to decrement stock for product {} by {} units - insufficient stock",
                                productId, quantity);
                    }
                } catch (IllegalArgumentException ex) {
                    log.error("[catalog] Invalid product ID format: {}", productIdStr, ex);
                }
            }
        } catch (Exception ex) {
            log.error("[catalog] Error processing payment.succeeded event", ex);
        }
    }
}


