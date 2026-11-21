package com.bloomscafe.notification.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "notification.email.mock", havingValue = "true", matchIfMissing = true)
public class MockEmailService implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(MockEmailService.class);

    @Override
    public void sendOrderConfirmationEmail(String toEmail, Long orderId, String customerName, Double totalAmount) {
        String subject = "Order Confirmation - BloomCafe Order #" + orderId;
        String body = buildEmailBody(orderId, customerName, totalAmount);

        log.info("┌─────────────────────────────────────────────────────────────┐");
        log.info("│ 📧 MOCK EMAIL SENT                                          │");
        log.info("├─────────────────────────────────────────────────────────────┤");
        log.info("│ To: {}", toEmail);
        log.info("│ Subject: {}", subject);
        log.info("│ Body:");
        for (String line : body.split("\n")) {
            log.info("│   {}", line);
        }
        log.info("└─────────────────────────────────────────────────────────────┘");
    }

    private String buildEmailBody(Long orderId, String customerName, Double totalAmount) {
        return String.format("""
            Dear %s,

            Thank you for your order at BloomCafe!

            Order Details:
            --------------
            Order ID: #%d
            Customer: %s
            Total Amount: ₹%.2f
            Status: CONFIRMED

            Your order has been placed successfully and is being prepared.
            You will receive another notification when your order is ready for pickup/delivery.

            Visit us at: Rajpur Road, Dehradun

            Thank you for choosing BloomCafe!
            """, customerName, orderId, customerName, totalAmount);
    }
}