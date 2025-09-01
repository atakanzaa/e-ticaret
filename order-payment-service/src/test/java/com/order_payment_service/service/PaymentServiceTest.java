package com.order_payment_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.order_payment_service.dto.iyzico.ThreeDSAuthResponse;
import com.order_payment_service.dto.iyzico.ThreeDSInitRequest;
import com.order_payment_service.dto.iyzico.ThreeDSInitResponse;
import com.order_payment_service.entity.Payment;
import com.order_payment_service.repository.PaymentRepository;
import com.order_payment_service.util.IyzicoClient;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private IyzicoClient iyzicoClient;

    @Mock
    private KafkaProducerService kafkaProducerService;

    @InjectMocks
    private PaymentService paymentService;

    @Test
    void shouldInitialize3DSPaymentSuccessfully() throws JsonProcessingException {
        // Given
        UUID orderId = UUID.randomUUID();
        ThreeDSInitRequest request = createThreeDSInitRequest();
        ThreeDSInitResponse expectedResponse = createThreeDSInitResponse();

        when(iyzicoClient.post(eq("/payment/3dsecure/initialize"), any(), eq(ThreeDSInitResponse.class)))
                .thenReturn(expectedResponse);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        ThreeDSInitResponse response = paymentService.initialize3DSPayment(orderId, request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo("success");
        assertThat(response.getPaymentId()).isEqualTo("payment-123");
    }

    @Test
    void shouldThrowExceptionWhenIyzicoClientFails() throws JsonProcessingException {
        // Given
        UUID orderId = UUID.randomUUID();
        ThreeDSInitRequest request = createThreeDSInitRequest();

        when(iyzicoClient.post(eq("/payment/3dsecure/initialize"), any(), eq(ThreeDSInitResponse.class)))
                .thenThrow(new JsonProcessingException("Parse error") {});

        // When & Then
        assertThatThrownBy(() -> paymentService.initialize3DSPayment(orderId, request))
                .isInstanceOf(JsonProcessingException.class);
    }

    @Test
    void shouldAuthorize3DSPaymentSuccessfully() throws JsonProcessingException {
        // Given
        String paymentId = "payment-123";
        String conversationData = "conversation-data";
        Payment payment = createPayment();
        ThreeDSAuthResponse expectedResponse = createThreeDSAuthResponse();

        when(paymentRepository.findByIyzPaymentId(paymentId)).thenReturn(java.util.Optional.of(payment));
        when(iyzicoClient.post(eq("/payment/v2/3dsecure/auth"), any(), eq(ThreeDSAuthResponse.class)))
                .thenReturn(expectedResponse);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        ThreeDSAuthResponse response = paymentService.authorize3DSPayment(paymentId, conversationData);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo("success");
    }

    private ThreeDSInitRequest createThreeDSInitRequest() {
        return ThreeDSInitRequest.builder()
                .locale("tr")
                .conversationId("conv-123")
                .price(BigDecimal.valueOf(100.00))
                .paidPrice(BigDecimal.valueOf(100.00))
                .currency("TRY")
                .installment(1)
                .build();
    }

    private ThreeDSInitResponse createThreeDSInitResponse() {
        return ThreeDSInitResponse.builder()
                .status("success")
                .locale("tr")
                .systemTime(1234567890)
                .conversationId("conv-123")
                .price(BigDecimal.valueOf(100.00))
                .paidPrice(BigDecimal.valueOf(100.00))
                .installment(1)
                .paymentId("payment-123")
                .fraudStatus("1")
                .threeDSHtmlContent("%3Cform%3E%3C%2Fform%3E") // URL encoded form
                .build();
    }

    private ThreeDSAuthResponse createThreeDSAuthResponse() {
        return ThreeDSAuthResponse.builder()
                .status("success")
                .locale("tr")
                .systemTime(1234567890)
                .conversationId("conv-123")
                .price(BigDecimal.valueOf(100.00))
                .paidPrice(BigDecimal.valueOf(100.00))
                .installment(1)
                .paymentId("payment-123")
                .fraudStatus("1")
                .authCode("123456")
                .cardFamily("Bonus")
                .cardAssociation("VISA")
                .cardType("CREDIT")
                .build();
    }

    private Payment createPayment() {
        return Payment.builder()
                .id(UUID.randomUUID())
                .orderId(UUID.randomUUID())
                .status(Payment.PaymentStatus.PENDING_3DS)
                .price(BigDecimal.valueOf(100.00))
                .paidPrice(BigDecimal.valueOf(100.00))
                .currency("TRY")
                .installment(1)
                .conversationId("conv-123")
                .iyzPaymentId("payment-123")
                .build();
    }
}
