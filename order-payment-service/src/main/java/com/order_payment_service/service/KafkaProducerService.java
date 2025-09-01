package com.order_payment_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.order_payment_service.dto.PaymentSucceededEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${kafka.topics.payment-succeeded}")
    private String paymentSucceededTopic;

    public void sendPaymentSucceededEvent(PaymentSucceededEvent event) {
        try {
            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(paymentSucceededTopic, event.getOrderId().toString(), message);
            log.info("Payment succeeded event sent to Kafka: {}", message);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize payment succeeded event", e);
            throw new RuntimeException("Failed to send payment succeeded event", e);
        }
    }
}
