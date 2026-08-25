package com.bloomscafe.notification.event;

import java.time.LocalDateTime;
import java.util.List;

public record OrderCreatedEvent(
        Long orderId,
        Long userId,
        List<OrderItemEvent> items,
        LocalDateTime createdAt
) {

    public record OrderItemEvent(
            Long productId,
            Integer quantity,
            Double price
    ) {
    }
}