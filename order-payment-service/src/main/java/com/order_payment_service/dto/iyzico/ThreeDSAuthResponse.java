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
public class ThreeDSAuthResponse {
    private String status;
    private String locale;
    private Integer systemTime;
    private String conversationId;
    private BigDecimal price;
    private BigDecimal paidPrice;
    private Integer installment;
    private String paymentId;
    private String fraudStatus;
    private String merchantCommissionRate;
    private String merchantCommissionRateAmount;
    private String iyziCommissionRateAmount;
    private String iyziCommissionFee;
    private String cardType;
    private String cardAssociation;
    private String cardFamily;
    private String cardToken;
    private String cardUserKey;
    private String binNumber;
    private String lastFourDigits;
    private String basketId;
    private String currency;
    private String itemTransactions;
    private String authCode;
    private String phase;
    private String hostReference;
    private String errorCode;
    private String errorMessage;
    private String errorGroup;
}
