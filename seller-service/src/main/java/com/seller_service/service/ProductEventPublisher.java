package com.seller_service.service;

import com.seller_service.event.ProductEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductEventPublisher {
    
    private final KafkaTemplate<String, ProductEvent> kafkaTemplate;
    private static final String PRODUCT_EVENTS_TOPIC = "product.events";
    
    public void publishProductCreated(ProductEvent event) {
        try {
            kafkaTemplate.send(PRODUCT_EVENTS_TOPIC, event.getProductId().toString(), event);
            log.info("Product created event published for product: {}", event.getProductId());
        } catch (Exception e) {
            log.error("Failed to publish product created event for product: {}", event.getProductId(), e);
        }
    }
    
    public void publishProductUpdated(ProductEvent event) {
        try {
            kafkaTemplate.send(PRODUCT_EVENTS_TOPIC, event.getProductId().toString(), event);
            log.info("Product updated event published for product: {}", event.getProductId());
        } catch (Exception e) {
            log.error("Failed to publish product updated event for product: {}", event.getProductId(), e);
        }
    }
    
    public void publishProductDeleted(ProductEvent event) {
        try {
            kafkaTemplate.send(PRODUCT_EVENTS_TOPIC, event.getProductId().toString(), event);
            log.info("Product deleted event published for product: {}", event.getProductId());
        } catch (Exception e) {
            log.error("Failed to publish product deleted event for product: {}", event.getProductId(), e);
        }
    }
}
