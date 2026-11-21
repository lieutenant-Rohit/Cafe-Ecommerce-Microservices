package com.bloomscafe.order.event;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderCreatedEvent(
        String eventId,
        Long orderId,
        Long userId,
        String userEmail,
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

