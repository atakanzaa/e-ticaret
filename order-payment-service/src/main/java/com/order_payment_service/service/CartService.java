package com.order_payment_service.service;

import com.order_payment_service.entity.Cart;
import com.order_payment_service.entity.CartItem;
import com.order_payment_service.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    @Transactional
    public Cart getOrCreateCart(UUID userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .userId(userId)
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    @Transactional
    public Cart addToCart(UUID userId, Map<String, Object> itemData) {
        Cart cart = getOrCreateCart(userId);

        UUID productId = UUID.fromString((String) itemData.get("productId"));
        String name = (String) itemData.get("name");
        Integer quantity = (Integer) itemData.get("quantity");
        BigDecimal price = new BigDecimal(itemData.get("price").toString());

        // Check if item already exists in cart
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Update quantity
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            // Add new item
            CartItem newItem = CartItem.builder()
                    .productId(productId)
                    .name(name)
                    .quantity(quantity)
                    .price(price)
                    .build();
            cart.addItem(newItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional(readOnly = true)
    public Cart getCart(UUID userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));
    }

    @Transactional
    public Cart updateCartItem(UUID userId, UUID itemId, Integer quantity) {
        Cart cart = getCart(userId);

        CartItem item = cart.getItems().stream()
                .filter(cartItem -> cartItem.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + itemId));

        if (quantity <= 0) {
            cart.removeItem(item);
        } else {
            item.setQuantity(quantity);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeFromCart(UUID userId, UUID itemId) {
        Cart cart = getCart(userId);

        CartItem item = cart.getItems().stream()
                .filter(cartItem -> cartItem.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + itemId));

        cart.removeItem(item);

        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(UUID userId) {
        Cart cart = getCart(userId);
        cart.getItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }
}
