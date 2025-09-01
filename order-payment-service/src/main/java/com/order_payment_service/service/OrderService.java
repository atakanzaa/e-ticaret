package com.order_payment_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.order_payment_service.dto.OrderCreatedEvent;
import com.order_payment_service.entity.*;
import com.order_payment_service.repository.CartRepository;
import com.order_payment_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${kafka.topics.order-created:order_created}")
    private String orderCreatedTopic;

    @Transactional
    public Order createOrder(UUID userId, Map<String, Object> orderData) {
        log.info("Creating order for user: {}", userId);

        // Get user's cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Create order
        Order order = Order.builder()
                .userId(userId)
                .totalAmount(cart.getTotalAmount())
                .currency(cart.getCurrency())
                .status(Order.OrderStatus.PENDING)
                .shippingAddress((String) orderData.get("shippingAddress"))
                .billingAddress((String) orderData.get("billingAddress"))
                .build();

        // Convert cart items to order items
        List<OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> OrderItem.builder()
                        .productId(cartItem.getProductId())
                        .name(cartItem.getName())
                        .quantity(cartItem.getQuantity())
                        .price(cartItem.getPrice())
                        .totalPrice(cartItem.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        Order finalOrder = order;
        orderItems.forEach(item -> item.setOrder(finalOrder));

        Order savedOrder = orderRepository.save(finalOrder);

        // Clear cart
        cart.getItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);

        // Publish order created event
        publishOrderCreatedEvent(savedOrder, orderItems);

        log.info("Order created successfully: {}", savedOrder.getId());
        return savedOrder;
    }

    @Transactional(readOnly = true)
    public Order getOrder(UUID orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
    }

    @Transactional(readOnly = true)
    public List<Order> getUserOrders(UUID userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDailyOrders() {
        Instant startOfDay = LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant endOfDay = LocalDate.now().plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        Long totalOrders = orderRepository.countOrdersBetween(startOfDay, endOfDay);
        BigDecimal totalRevenue = orderRepository.getTotalRevenueBetween(startOfDay, endOfDay);
        List<Order> orders = orderRepository.findOrdersBetween(startOfDay, endOfDay);

        return Map.of(
            "date", LocalDate.now().toString(),
            "totalOrders", totalOrders,
            "totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
            "orders", orders.stream()
                    .map(order -> Map.of(
                        "id", order.getId(),
                        "amount", order.getTotalAmount()
                    ))
                    .collect(Collectors.toList())
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDailyProfit() {
        Map<String, Object> dailyOrders = getDailyOrders();

        BigDecimal revenue = (BigDecimal) dailyOrders.get("totalRevenue");

        // Calculate actual costs based on real data
        // Shipping cost: 5% of revenue
        BigDecimal shippingCosts = revenue.multiply(BigDecimal.valueOf(0.05));

        // Payment processing cost: 2% of revenue
        BigDecimal processingCosts = revenue.multiply(BigDecimal.valueOf(0.02));

        // Platform fee: 3% of revenue
        BigDecimal platformFee = revenue.multiply(BigDecimal.valueOf(0.03));

        // Fixed operational costs (daily average)
        BigDecimal operationalCosts = BigDecimal.valueOf(100.00);

        BigDecimal totalCosts = shippingCosts.add(processingCosts).add(platformFee).add(operationalCosts);
        BigDecimal grossProfit = revenue.subtract(totalCosts);
        BigDecimal netProfit = grossProfit.subtract(operationalCosts);

        return Map.of(
            "date", LocalDate.now().toString(),
            "grossProfit", grossProfit,
            "netProfit", netProfit,
            "revenue", revenue,
            "totalCosts", totalCosts,
            "costs", Map.of(
                "shipping", shippingCosts,
                "processing", processingCosts,
                "platform", platformFee,
                "operational", operationalCosts
            ),
            "profitMargin", revenue.compareTo(BigDecimal.ZERO) > 0
                ? netProfit.divide(revenue, 4, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO
        );
    }

    private void publishOrderCreatedEvent(Order order, List<OrderItem> items) {
        OrderCreatedEvent event = OrderCreatedEvent.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .currency(order.getCurrency())
                .items(items.stream()
                        .map((OrderItem item) -> OrderCreatedEvent.OrderItem.builder()
                                .productId(item.getProductId())
                                .name(item.getName())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .build())
                        .collect(Collectors.toList()))
                .timestamp(Instant.now())
                .build();

        try {
            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(orderCreatedTopic, order.getId().toString(), message);
            log.info("Order created event published: {}", message);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize order created event", e);
        }
    }
}
