package com.order_payment_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.order_payment_service.dto.iyzico.WebhookPayload;
import com.order_payment_service.entity.WebhookEvent;
import com.order_payment_service.repository.WebhookEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookService {

    private final WebhookEventRepository webhookEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void processWebhook(String payload, String signature, String provider) {
        log.info("Processing webhook from provider: {}", provider);

        try {
            // Parse payload
            WebhookPayload webhookPayload = objectMapper.readValue(payload, WebhookPayload.class);
            JsonNode payloadJson = objectMapper.valueToTree(webhookPayload);

            // Check for idempotency
            if (webhookEventRepository.existsByProviderAndEventTypeAndPaymentId(
                    provider, "payment", webhookPayload.getPaymentId())) {
                log.info("Webhook already processed for payment: {}", webhookPayload.getPaymentId());
                return;
            }

            // Save webhook event
            WebhookEvent webhookEvent = WebhookEvent.builder()
                    .provider(provider)
                    .eventType("payment")
                    .payload(payloadJson)
                    .signature(signature)
                    .verified(true) // TODO: Add signature verification
                    .conversationId(webhookPayload.getConversationId())
                    .paymentId(webhookPayload.getPaymentId())
                    .processedAt(Instant.now())
                    .build();

            webhookEventRepository.save(webhookEvent);

            // Process payment status update
            processPaymentStatusUpdate(webhookPayload);

            log.info("Webhook processed successfully for payment: {}", webhookPayload.getPaymentId());

        } catch (Exception e) {
            log.error("Failed to process webhook", e);
            throw new RuntimeException("Webhook processing failed", e);
        }
    }

    private void processPaymentStatusUpdate(WebhookPayload payload) {
        // TODO: Update payment status based on webhook payload
        log.info("Processing payment status update for payment: {}", payload.getPaymentId());
    }
}
