package com.order_payment_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payment_items", schema = "order_payment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @Column(name = "item_id", nullable = false)
    private String itemId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "paid_price", precision = 10, scale = 2)
    private BigDecimal paidPrice;

    @Column(name = "iyz_item_tx_id")
    private String iyzItemTxId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentItemStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public enum PaymentItemStatus {
        PENDING,
        SUCCEEDED,
        FAILED
    }
}
