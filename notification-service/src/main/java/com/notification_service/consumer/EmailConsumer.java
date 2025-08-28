package com.notification_service.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.internet.MimeMessage;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailConsumer {

    private final JavaMailSender mailSender;

    @Autowired
    private Queue emailSendQueue;

    @RabbitListener(queues = "#{emailSendQueue.getName()}")
    public void onEmailSend(Map<String, Object> payload) {
        log.info("[notification] email.send received: {}", payload);

        try {
            String to = (String) payload.getOrDefault("to", "test@example.com");
            String subject = (String) payload.getOrDefault("subject", "E-Ticaret Bildirim");
            String html = (String) payload.getOrDefault("html", "<p>Merhaba</p>");

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);

            mailSender.send(mimeMessage);
            log.info("[notification] mail sent (html)");
        } catch (Exception e) {
            log.warn("[notification] mail send failed: {}", e.getMessage());
        }
    }
}


