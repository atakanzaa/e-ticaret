package com.order_payment_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/")
public class OrderPaymentController {

    @PostMapping("/api/order/cart/items")
    public ResponseEntity<Map<String, Object>> addToCart(@RequestBody Map<String, Object> body) {
        // TODO: persist to db
        return ResponseEntity.ok(Map.of("cartId", UUID.randomUUID()));
    }

    @PostMapping("/api/order/checkout")
    public ResponseEntity<Map<String, Object>> checkout(@RequestBody Map<String, Object> body, @RequestHeader("Idempotency-Key") String key) {
        // TODO: idempotency check + create order + emit order.created
        return ResponseEntity.ok(Map.of("orderId", UUID.randomUUID()));
    }

    @GetMapping("/api/order/{id}")
    public ResponseEntity<Map<String, Object>> getOrder(@PathVariable String id) {
        // TODO: fetch order
        return ResponseEntity.ok(Map.of("id", id));
    }

    @PostMapping("/api/payment/{orderId}/init")
    public ResponseEntity<Map<String, Object>> initPayment(@PathVariable String orderId) {
        // TODO: call iyzico mock
        return ResponseEntity.ok(Map.of("checkoutToken", UUID.randomUUID().toString()));
    }

    @PostMapping("/api/payment/iyzico/webhook")
    public ResponseEntity<Map<String, Object>> iyzicoWebhook(@RequestBody Map<String, Object> body) {
        // TODO: verify and publish payment.succeeded/failed
        return ResponseEntity.ok(Map.of("status", "received"));
    }
}


