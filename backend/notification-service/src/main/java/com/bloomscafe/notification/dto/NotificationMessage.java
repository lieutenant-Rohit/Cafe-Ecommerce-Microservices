package com.bloomscafe.notification.dto;

public record NotificationMessage(
        Long orderId,
        Long userId,
        String message
) {
}