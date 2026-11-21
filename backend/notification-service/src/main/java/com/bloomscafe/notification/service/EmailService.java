package com.bloomscafe.notification.service;

public interface EmailService {

    void sendOrderConfirmationEmail(String toEmail, Long orderId, String customerName, Double totalAmount);
}