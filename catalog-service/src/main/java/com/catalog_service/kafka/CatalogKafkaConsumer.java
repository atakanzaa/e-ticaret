package com.catalog_service.kafka;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Component
public class CatalogKafkaConsumer {

    @KafkaListener(topics = "payment.succeeded", groupId = "catalog")
    @Transactional
    public void onPaymentSucceeded(Map<String, Object> e) {
        log.info("[catalog] payment.succeeded received: {}", e);
        // TODO: decrement stocks based on order items
    }
}


