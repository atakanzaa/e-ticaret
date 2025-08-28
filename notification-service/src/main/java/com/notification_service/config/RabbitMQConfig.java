package com.notification_service.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public Queue emailSendQueue() {
        return QueueBuilder.durable("email.send")
                .withArgument("x-message-ttl", 3600000L) // 1 hour in milliseconds
                .build();
    }
}
