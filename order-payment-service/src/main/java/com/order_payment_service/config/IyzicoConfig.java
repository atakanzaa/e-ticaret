package com.order_payment_service.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "iyzico")
@Data
public class IyzicoConfig {
    private Api api = new Api();
    private Payment payment = new Payment();

    @Data
    public static class Api {
        private String baseUrl;
        private String key;
        private String secret;
        private String callbackUrl;
    }

    @Data
    public static class Payment {
        private String currency;
        private String locale;
    }
}
