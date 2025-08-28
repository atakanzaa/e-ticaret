package com.auth_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.core.MessagePostProcessor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishEmail(Map<String, Object> payload) {
        try {
            MessagePostProcessor persistent = m -> {
                m.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);
                return m;
            };
            rabbitTemplate.convertAndSend("", "email.send", payload, persistent);
        } catch (Exception e) {
            // Do not block user flows in dev if messaging infra is down
            log.warn("email.send publish failed (non-blocking): {}", e.getMessage());
        }
    }
}


