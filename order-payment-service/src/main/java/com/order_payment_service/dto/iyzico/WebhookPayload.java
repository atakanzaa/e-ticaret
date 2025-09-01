package com.order_payment_service.dto.iyzico;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebhookPayload {
    private String paymentId;
    private String paymentTransactionId;
    private String externalId;
    private String conversationId;
    private BigDecimal price;
    private BigDecimal paidPrice;
    private Integer installment;
    private String buyerId;
    private String buyerName;
    private String buyerSurname;
    private String buyerEmail;
    private String buyerPhone;
    private String basketId;
    private String currency;
    private String paymentStatus;
    private String paymentType;
    private String cardFamily;
    private String cardAssociation;
    private String cardType;
    private String binNumber;
    private String lastFourDigits;
    private String authCode;
    private String hostReference;
    private String orderId;
    private String itemId;
    private String paymentCardToken;
    private String cardUserKey;
    private String cardToken;
    private String fraudStatus;
    private String iyziCommissionFee;
    private String iyziCommissionRateAmount;
    private String merchantCommissionRate;
    private String merchantCommissionRateAmount;
    private String phase;
    private String mDStatus;
    private String errorCode;
    private String errorMessage;
    private String errorGroup;
    private String createdDate;
    private String updatedDate;
}
