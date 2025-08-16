package com.notification_service.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailConsumer {

    private final JavaMailSender mailSender;

    @RabbitListener(queuesToDeclare = @Queue("email.send"))
    public void onEmailSend(Map<String, Object> payload) {
        log.info("[notification] email.send received: {}", payload);

        try {
            String to = (String) payload.getOrDefault("to", "test@example.com");
            String subject = (String) payload.getOrDefault("subject", "Test");
            String html = (String) payload.getOrDefault("html", "<p>Mail</p>");

            // For dev: use SimpleMailMessage (text-only). In real, use MimeMessageHelper for HTML
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(html);
            mailSender.send(message);
            log.info("[notification] mail sent (dev)");
        } catch (Exception e) {
            log.warn("[notification] mail send failed (dev): {}", e.getMessage());
        }
    }
}


