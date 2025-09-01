package com.order_payment_service.dto.iyzico;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThreeDSAuthRequest {
    private String locale;
    private String conversationId;
    private String paymentId;
    private String conversationData;
}
