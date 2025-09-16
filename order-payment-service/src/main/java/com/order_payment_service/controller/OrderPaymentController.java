package com.order_payment_service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.order_payment_service.dto.iyzico.*;
import com.order_payment_service.entity.Cart;
import com.order_payment_service.entity.IdempotencyKey;
import com.order_payment_service.entity.Order;
import com.order_payment_service.repository.IdempotencyKeyRepository;
import com.order_payment_service.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.MessageDigest;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

@Slf4j
@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class OrderPaymentController {

    private final PaymentService paymentService;
    private final WebhookService webhookService;
    private final CartService cartService;
    private final OrderService orderService;
    private final IdempotencyKeyRepository idempotencyKeyRepository;
    private final RestTemplate restTemplate;
    
    @Value("${auth.service.url:http://auth:8081}")
    private String authServiceUrl;

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

    @GetMapping("/api/cart")
    public ResponseEntity<Map<String, Object>> getCart(@RequestHeader(value = "X-User-Id", required = false) String userId) {
        try {
            UUID uid = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
            Cart cart = cartService.getOrCreateCart(uid);
            int itemCount = cart.getItems().stream().mapToInt(i -> i.getQuantity()).sum();
            List<java.util.Map<String, Object>> items = cart.getItems().stream().map(i -> java.util.Map.<String, Object>of(
                    "id", i.getId(),
                    "productId", i.getProductId(),
                    "name", i.getName(),
                    "quantity", i.getQuantity(),
                    "price", i.getPrice(),
                    "totalPrice", i.getTotalPrice()
            )).toList();
            return ResponseEntity.ok(java.util.Map.of(
                    "items", items,
                    "itemCount", itemCount,
                    "totalAmount", cart.getTotalAmount()
            ));
        } catch (Exception e) {
            log.error("Failed to fetch cart", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch cart"));
        }
    }

    @GetMapping("/api/orders")
    public ResponseEntity<List<Map<String, Object>>> listOrders(@RequestHeader(value = "X-User-Id", required = false) String userId) {
        try {
            UUID uid = userId == null ? UUID.randomUUID() : UUID.fromString(userId);
            List<Order> list = orderService.getUserOrders(uid);
            List<java.util.Map<String, Object>> dto = list.stream().map(o -> java.util.Map.<String, Object>of(
                    "id", o.getId(),
                    "totalAmount", o.getTotalAmount(),
                    "currency", o.getCurrency(),
                    "status", o.getStatus(),
                    "createdAt", o.getCreatedAt()
            )).toList();
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            log.error("Failed to list orders", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Collections.<java.util.Map<String, Object>>emptyList());
        }
    }

    @PostMapping("/api/order/checkout")
    public ResponseEntity<Map<String, Object>> checkout(@RequestBody Map<String, Object> body,
                                                       @RequestHeader("Idempotency-Key") String idempotencyKey,
                                                       @RequestHeader(value = "X-User-Id", required = false) String userId) {
        try {
            UUID uid = userId == null ? UUID.randomUUID() : UUID.fromString(userId);

            // Idempotency check using IdempotencyKey entity
            if (idempotencyKeyRepository.existsByKey(idempotencyKey)) {
                log.warn("Duplicate request detected for idempotency key: {}", idempotencyKey);
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Duplicate request - idempotency key already used"));
            }

            log.info("Processing checkout for user: {} with idempotency key: {}", uid, idempotencyKey);

            // Create hash of request body for additional verification
            String requestHash = createRequestHash(body.toString());
            
            // Save idempotency key
            IdempotencyKey idempotencyKeyEntity = IdempotencyKey.builder()
                    .key(idempotencyKey)
                    .requestHash(requestHash)
                    .build();
            idempotencyKeyRepository.save(idempotencyKeyEntity);

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
                    .buyer(createBuyerFromUserService(uid))
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

    private String createRequestHash(String requestBody) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(requestBody.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            log.error("Failed to create request hash", e);
            return requestBody.hashCode() + "";
        }
    }

    private ThreeDSInitRequest.Buyer createBuyerFromUserService(UUID userId) {
        try {
            // Call auth service to get user details
            String url = authServiceUrl + "/me";
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("X-User-Id", userId.toString());
            
            org.springframework.http.HttpEntity<?> entity = new org.springframework.http.HttpEntity<>(headers);
            org.springframework.http.ResponseEntity<Map> response = restTemplate.exchange(
                url, org.springframework.http.HttpMethod.GET, entity, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> userDetails = response.getBody();
                
                return ThreeDSInitRequest.Buyer.builder()
                        .id(userId.toString())
                        .name((String) userDetails.getOrDefault("firstName", "User"))
                        .surname((String) userDetails.getOrDefault("lastName", "Name"))
                        .identityNumber("12345678901") // This would come from a separate profile service
                        .email((String) userDetails.getOrDefault("email", "user@example.com"))
                        .gsmNumber((String) userDetails.getOrDefault("phone", "+905551234567"))
                        .registrationDate("2024-01-01") // This could be derived from createdAt
                        .lastLoginDate("2024-01-15") // This would come from auth logs
                        .registrationAddress("Istanbul") // This would come from profile service
                        .city("Istanbul")
                        .country("Turkey")
                        .zipCode("34000")
                        .ip("127.0.0.1") // This should come from request
                        .build();
            }
        } catch (Exception e) {
            log.error("Failed to fetch user details from auth service for user: {}", userId, e);
        }
        
        // Fallback to default values if user service call fails
        return ThreeDSInitRequest.Buyer.builder()
                .id(userId.toString())
                .name("User")
                .surname("Name")
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
                .build();
    }
}


