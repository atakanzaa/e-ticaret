package com.order_payment_service.dto.iyzico;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThreeDSInitRequest {
    private String locale;
    private String conversationId;
    private BigDecimal price;
    private BigDecimal paidPrice;
    private String currency;
    private Integer installment;
    private String basketId;
    private String paymentChannel;
    private String paymentGroup;
    private String paymentSource;
    private Buyer buyer;
    private ShippingAddress shippingAddress;
    private BillingAddress billingAddress;
    private List<BasketItem> basketItems;
    private String callbackUrl;
    private String paymentCard;
    private String merchantCallbackUrl;
    private String merchantErrorUrl;
    private String merchantSuccessUrl;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Buyer {
        private String id;
        private String name;
        private String surname;
        private String identityNumber;
        private String email;
        private String gsmNumber;
        private String registrationDate;
        private String lastLoginDate;
        private String registrationAddress;
        private String city;
        private String country;
        private String zipCode;
        private String ip;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingAddress {
        private String address;
        private String zipCode;
        private String contactName;
        private String city;
        private String country;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillingAddress {
        private String address;
        private String zipCode;
        private String contactName;
        private String city;
        private String country;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BasketItem {
        private String id;
        private String name;
        private String category1;
        private String category2;
        private String itemType;
        private String price;
        private String subMerchantKey;
        private String subMerchantPrice;
    }
}
