package com.order_payment_service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.order_payment_service.dto.iyzico.*;
import com.order_payment_service.entity.Cart;
import com.order_payment_service.entity.Order;
import com.order_payment_service.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class OrderPaymentController {

    private final PaymentService paymentService;
    private final WebhookService webhookService;
    private final CartService cartService;
    private final OrderService orderService;

    @PostMapping("/api/order/cart/items")
    public ResponseEntity<Map<String, Object>> addToCart(@RequestBody Map<String, Object> body,
                                                        @RequestHeader(value = "X-User-Id", required = false) String userId) {
        try {
            UUID uid = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
            Cart cart = cartService.addToCart(uid, body);

            return ResponseEntity.ok(Map.of(
                "cartId", cart.getId(),
                "totalAmount", cart.getTotalAmount(),
                "itemCount", cart.getItems().size()
            ));
        } catch (Exception e) {
            log.error("Failed to add item to cart", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add item to cart"));
        }
    }

    @PostMapping("/api/order/checkout")
    public ResponseEntity<Map<String, Object>> checkout(@RequestBody Map<String, Object> body,
                                                       @RequestHeader("Idempotency-Key") String idempotencyKey,
                                                       @RequestHeader(value = "X-User-Id", required = false) String userId) {
        try {
            UUID uid = userId == null ? UUID.randomUUID() : UUID.fromString(userId);

            // TODO: Add idempotency check using IdempotencyKey entity
            log.info("Processing checkout for user: {} with idempotency key: {}", uid, idempotencyKey);

            Order order = orderService.createOrder(uid, body);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "orderId", order.getId(),
                "totalAmount", order.getTotalAmount(),
                "currency", order.getCurrency(),
                "status", order.getStatus()
            ));
        } catch (Exception e) {
            log.error("Failed to create order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create order"));
        }
    }

    @GetMapping("/api/order/{id}")
    public ResponseEntity<Map<String, Object>> getOrder(@PathVariable String id,
                                                       @RequestHeader(value = "X-User-Id", required = false) String userId) {
        try {
            UUID uid = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
            Order order = orderService.getOrder(UUID.fromString(id));

            // TODO: Check if user owns this order for security
            log.info("Fetching order: {} for user: {}", id, uid);

            return ResponseEntity.ok(Map.of(
                "id", order.getId(),
                "userId", order.getUserId(),
                "totalAmount", order.getTotalAmount(),
                "currency", order.getCurrency(),
                "status", order.getStatus(),
                "shippingAddress", order.getShippingAddress(),
                "billingAddress", order.getBillingAddress(),
                "createdAt", order.getCreatedAt(),
                "updatedAt", order.getUpdatedAt()
            ));
        } catch (RuntimeException e) {
            log.error("Order not found: {}", id, e);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Failed to fetch order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch order"));
        }
    }

    @PostMapping("/api/payment/{orderId}/init")
    public ResponseEntity<?> initPayment(@PathVariable String orderId,
                                        @RequestHeader(value = "X-User-Id", required = false) String userId) {
        try {
            UUID uid = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
            log.info("Initializing payment for order: {} by user: {}", orderId, uid);

            // Get order details
            Order order = orderService.getOrder(UUID.fromString(orderId));

            // Create 3DS init request
            ThreeDSInitRequest request = ThreeDSInitRequest.builder()
                    .locale("tr")
                    .conversationId("conv-" + orderId + "-" + System.currentTimeMillis())
                    .price(order.getTotalAmount())
                    .paidPrice(order.getTotalAmount())
                    .currency(order.getCurrency())
                    .installment(1)
                    .basketId("basket-" + orderId)
                    .paymentChannel("WEB")
                    .paymentGroup("PRODUCT")
                    .paymentSource("DEFAULT")
                    .buyer(ThreeDSInitRequest.Buyer.builder()
                            .id(uid.toString())
                            .name("User Name") // TODO: Get from user service
                            .surname("Surname")
                            .identityNumber("12345678901")
                            .email("user@example.com")
                            .gsmNumber("+905551234567")
                            .registrationDate("2024-01-01")
                            .lastLoginDate("2024-01-15")
                            .registrationAddress("Istanbul")
                            .city("Istanbul")
                            .country("Turkey")
                            .zipCode("34000")
                            .ip("127.0.0.1")
                            .build())
                    .shippingAddress(ThreeDSInitRequest.ShippingAddress.builder()
                            .address(order.getShippingAddress() != null ? order.getShippingAddress() : "Shipping Address")
                            .zipCode("34000")
                            .contactName("User Name")
                            .city("Istanbul")
                            .country("Turkey")
                            .build())
                    .billingAddress(ThreeDSInitRequest.BillingAddress.builder()
                            .address(order.getBillingAddress() != null ? order.getBillingAddress() : "Billing Address")
                            .zipCode("34000")
                            .contactName("User Name")
                            .city("Istanbul")
                            .country("Turkey")
                            .build())
                    .basketItems(List.of(
                            ThreeDSInitRequest.BasketItem.builder()
                                    .id("item-1")
                                    .name("Order Items")
                                    .category1("General")
                                    .category2("Products")
                                    .itemType("PHYSICAL")
                                    .price(order.getTotalAmount().toString())
                                    .build()
                    ))
                    .callbackUrl("http://localhost:8086/api/payment/3ds/callback")
                    .merchantCallbackUrl("http://localhost:8080/payment/callback")
                    .merchantErrorUrl("http://localhost:8080/payment/error")
                    .merchantSuccessUrl("http://localhost:8080/payment/success")
                    .build();

            ThreeDSInitResponse response = paymentService.initialize3DSPayment(UUID.fromString(orderId), request);

            return ResponseEntity.ok(Map.of(
                "paymentId", response.getPaymentId(),
                "conversationId", response.getConversationId(),
                "threeDSHtmlContent", response.getThreeDSHtmlContent(),
                "status", response.getStatus()
            ));

        } catch (JsonProcessingException e) {
            log.error("Failed to initialize payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to initialize payment"));
        } catch (RuntimeException e) {
            log.error("Order not found for payment init", e);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/api/payment/iyzico/webhook")
    public ResponseEntity<Map<String, Object>> iyzicoWebhook(@RequestBody String payload,
                                                            @RequestHeader("x-iyzi-signature") String signature) {
        try {
            log.info("Received iyzico webhook with signature: {}", signature);

            // Process webhook with signature verification and idempotency
            webhookService.processWebhook(payload, signature, "iyzico");

            log.info("Webhook processed successfully");
            return ResponseEntity.ok(Map.of("status", "processed"));

        } catch (Exception e) {
            log.error("Failed to process iyzico webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process webhook"));
        }
    }

    @GetMapping("/api/orders/daily")
    public ResponseEntity<Map<String, Object>> getDailyOrders() {
        try {
            log.info("Fetching daily orders");
            Map<String, Object> dailyOrders = orderService.getDailyOrders();
            return ResponseEntity.ok(dailyOrders);
        } catch (Exception e) {
            log.error("Failed to fetch daily orders", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch daily orders"));
        }
    }

    @GetMapping("/api/orders/profit/daily")
    public ResponseEntity<Map<String, Object>> getDailyProfit() {
        try {
            log.info("Fetching daily profit");
            Map<String, Object> dailyProfit = orderService.getDailyProfit();
            return ResponseEntity.ok(dailyProfit);
        } catch (Exception e) {
            log.error("Failed to fetch daily profit", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch daily profit"));
        }
    }

    @PostMapping("/api/payment/3ds/init")
    public ResponseEntity<?> initialize3DSPayment(@RequestBody ThreeDSInitRequest request,
                                                  @RequestParam UUID orderId) {
        try {
            log.info("Initializing 3DS payment for order: {}", orderId);
            ThreeDSInitResponse response = paymentService.initialize3DSPayment(orderId, request);
            return ResponseEntity.ok(response);
        } catch (JsonProcessingException e) {
            log.error("Failed to initialize 3DS payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to initialize 3DS payment"));
        }
    }

    @PostMapping("/api/payment/3ds/callback")
    public ResponseEntity<?> handle3DSCallback(@RequestParam String paymentId,
                                               @RequestParam String conversationData) {
        try {
            log.info("Processing 3DS callback for payment: {}", paymentId);
            ThreeDSAuthResponse response = paymentService.authorize3DSPayment(paymentId, conversationData);
            return ResponseEntity.ok(response);
        } catch (JsonProcessingException e) {
            log.error("Failed to authorize 3DS payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to authorize 3DS payment"));
        } catch (RuntimeException e) {
            log.error("Payment not found", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Payment not found"));
        }
    }

    @PostMapping("/api/payment/webhook/iyzico")
    public ResponseEntity<?> handleIyzicoWebhook(@RequestBody String payload,
                                                 @RequestHeader("x-iyzi-signature") String signature) {
        try {
            log.info("Received iyzico webhook");
            webhookService.processWebhook(payload, signature, "iyzico");
            return ResponseEntity.ok(Map.of("status", "processed"));
        } catch (Exception e) {
            log.error("Failed to process iyzico webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process webhook"));
        }
    }
}


