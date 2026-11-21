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
@ConditionalOnProperty(name = "notification.email.mock", havingValue = "false")
public class RealEmailService implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(RealEmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public RealEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOrderConfirmationEmail(String toEmail, Long orderId, String customerName, Double totalAmount) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Order Confirmation - BloomCafe Order #" + orderId);
            helper.setText(buildHtmlEmailBody(orderId, customerName, totalAmount), true);

            mailSender.send(message);
            log.info("Real email sent to {} for order #{}", toEmail, orderId);

        } catch (MessagingException e) {
            log.error("Failed to send email to {} for order #{}: {}", toEmail, orderId, e.getMessage());
            // Fallback to mock logging
            log.info("┌─────────────────────────────────────────────────────────────┐");
            log.info("│ 📧 MOCK EMAIL SENT (fallback)                               │");
            log.info("├─────────────────────────────────────────────────────────────┤");
            log.info("│ To: {}", toEmail);
            log.info("│ Subject: Order Confirmation - BloomCafe Order #{}", orderId);
            log.info("│ Body:");
            for (String line : buildEmailBody(orderId, customerName, totalAmount).split("\n")) {
                log.info("│   {}", line);
            }
            log.info("└─────────────────────────────────────────────────────────────┘");
        }
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

    private String buildHtmlEmailBody(Long orderId, String customerName, Double totalAmount) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #8B5E3C, #C9A876); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .detail-row:last-child { border-bottom: none; font-weight: bold; font-size: 1.1em; color: #8B5E3C; }
                    .label { color: #666; }
                    .value { font-weight: 500; }
                    .footer { text-align: center; padding: 20px; color: #888; font-size: 0.9em; }
                    .btn { display: inline-block; background: #8B5E3C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>☕ BloomCafe</h1>
                    <p>Your Order Confirmation</p>
                </div>
                <div class="content">
                    <p>Dear <strong>%s</strong>,</p>
                    <p>Thank you for your order at BloomCafe! We're delighted to serve you.</p>

                    <div class="order-details">
                        <div class="detail-row">
                            <span class="label">Order ID:</span>
                            <span class="value">#%d</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Customer:</span>
                            <span class="value">%s</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Total Amount:</span>
                            <span class="value">₹%.2f</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Status:</span>
                            <span class="value" style="color: #28a745;">CONFIRMED</span>
                        </div>
                    </div>

                    <p>Your order has been placed successfully and is being prepared.</p>
                    <p>You will receive another notification when your order is ready for pickup/delivery.</p>

                    <p style="margin-top: 30px;">
                        <strong>Visit us at:</strong> Rajpur Road, Dehradun
                    </p>

                    <p>Thank you for choosing BloomCafe!</p>
                    <p style="color: #8B5E3C; font-weight: bold;">The BloomCafe Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated email. Please do not reply.</p>
                    <p>© 2026 BloomCafe. All rights reserved.</p>
                </div>
            </body>
            </html>
            """, customerName, orderId, customerName, totalAmount);
    }
}