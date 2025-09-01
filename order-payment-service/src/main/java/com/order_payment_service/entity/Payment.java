package com.order_payment_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payments", schema = "order_payment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "order_id", nullable = false)
    private UUID orderId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "paid_price", precision = 12, scale = 2)
    private BigDecimal paidPrice;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(nullable = false)
    private Integer installment;

    @Column(name = "conversation_id")
    private String conversationId;

    @Column(name = "iyz_payment_id")
    private String iyzPaymentId;

    @Column(name = "iyz_auth_code")
    private String iyzAuthCode;

    @Column(name = "iyz_fraud_status")
    private String iyzFraudStatus;

    @Column(name = "iyz_error_code")
    private String iyzErrorCode;

    @Column(name = "iyz_error_message")
    private String iyzErrorMessage;

    @Column(name = "card_family")
    private String cardFamily;

    @Column(name = "card_association")
    private String cardAssociation;

    @Column(name = "card_type")
    private String cardType;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum PaymentStatus {
        PENDING_3DS,
        AUTHORIZED,
        SUCCEEDED,
        FAILED,
        CANCELLED
    }
}
