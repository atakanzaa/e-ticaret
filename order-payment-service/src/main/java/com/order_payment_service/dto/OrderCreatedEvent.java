package com.order_payment_service.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class OrderCreatedEvent {
    private UUID orderId;
    private UUID userId;
    private BigDecimal totalAmount;
    private String currency;
    private List<OrderItem> items;
    private Instant timestamp;

    @Data
    @Builder
    public static class OrderItem {
        private UUID productId;
        private String name;
        private Integer quantity;
        private BigDecimal price;
    }
}
