package com.order_payment_service.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSucceededEvent {
    private UUID orderId;
    private String conversationId;
    private String paymentId;
    private BigDecimal paidPrice;
    private String currency;
    private Integer installment;
    private String cardFamily;
    private String cardAssociation;
    private String cardType;
    private String authCode;
    private Instant timestamp;
    private String status;
}
