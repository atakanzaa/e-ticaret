package com.order_payment_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.order_payment_service.dto.PaymentSucceededEvent;
import com.order_payment_service.dto.iyzico.*;
import com.order_payment_service.entity.Payment;
import com.order_payment_service.repository.PaymentRepository;
import com.order_payment_service.util.IyzicoClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final IyzicoClient iyzicoClient;
    private final KafkaProducerService kafkaProducerService;

    @Value("${kafka.topics.payment-succeeded}")
    private String paymentSucceededTopic;

    @Transactional
    public ThreeDSInitResponse initialize3DSPayment(UUID orderId, ThreeDSInitRequest request) throws JsonProcessingException {
        log.info("Initializing 3DS payment for order: {}", orderId);

        // Save initial payment record
        Payment payment = Payment.builder()
                .orderId(orderId)
                .status(Payment.PaymentStatus.PENDING_3DS)
                .price(request.getPrice())
                .paidPrice(request.getPaidPrice())
                .currency(request.getCurrency())
                .installment(request.getInstallment())
                .conversationId(request.getConversationId())
                .build();

        payment = paymentRepository.save(payment);

        // Call iyzico 3DS initialize
        ThreeDSInitResponse response = iyzicoClient.post("/payment/3dsecure/initialize", request, ThreeDSInitResponse.class);

        // Update payment with iyzico payment ID
        if (response.getPaymentId() != null) {
            payment.setIyzPaymentId(response.getPaymentId());
            paymentRepository.save(payment);
        }

        return response;
    }

    @Transactional
    public ThreeDSAuthResponse authorize3DSPayment(String paymentId, String conversationData) throws JsonProcessingException {
        log.info("Authorizing 3DS payment: {}", paymentId);

        Payment payment = paymentRepository.findByIyzPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));

        ThreeDSAuthRequest authRequest = ThreeDSAuthRequest.builder()
                .paymentId(paymentId)
                .conversationId(payment.getConversationId())
                .conversationData(conversationData)
                .locale("tr")
                .build();

        ThreeDSAuthResponse response = iyzicoClient.post("/payment/v2/3dsecure/auth", authRequest, ThreeDSAuthResponse.class);

        // Update payment status based on response
        updatePaymentStatus(payment, response);

        if ("success".equalsIgnoreCase(response.getStatus())) {
            publishPaymentSucceededEvent(payment, response);
        }

        return response;
    }

    private void updatePaymentStatus(Payment payment, ThreeDSAuthResponse response) {
        Payment.PaymentStatus newStatus;
        if ("success".equalsIgnoreCase(response.getStatus())) {
            newStatus = Payment.PaymentStatus.SUCCEEDED;
        } else {
            newStatus = Payment.PaymentStatus.FAILED;
        }

        payment.setStatus(newStatus);
        payment.setPaidPrice(response.getPaidPrice());
        payment.setIyzAuthCode(response.getAuthCode());
        payment.setIyzFraudStatus(response.getFraudStatus());
        payment.setIyzErrorCode(response.getErrorCode());
        payment.setIyzErrorMessage(response.getErrorMessage());
        payment.setCardFamily(response.getCardFamily());
        payment.setCardAssociation(response.getCardAssociation());
        payment.setCardType(response.getCardType());

        paymentRepository.save(payment);
    }

    private void publishPaymentSucceededEvent(Payment payment, ThreeDSAuthResponse response) {
        PaymentSucceededEvent event = PaymentSucceededEvent.builder()
                .orderId(payment.getOrderId())
                .conversationId(payment.getConversationId())
                .paymentId(payment.getIyzPaymentId())
                .paidPrice(response.getPaidPrice())
                .currency(response.getCurrency())
                .installment(response.getInstallment())
                .cardFamily(response.getCardFamily())
                .cardAssociation(response.getCardAssociation())
                .cardType(response.getCardType())
                .authCode(response.getAuthCode())
                .timestamp(Instant.now())
                .status("SUCCEEDED")
                .build();

        kafkaProducerService.sendPaymentSucceededEvent(event);
    }

    public Payment getPaymentByOrderId(UUID orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order: " + orderId));
    }
}
