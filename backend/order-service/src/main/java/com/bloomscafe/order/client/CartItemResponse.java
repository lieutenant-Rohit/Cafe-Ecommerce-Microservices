package com.bloomscafe.order.client;

public record CartItemResponse(
        Long id,
        Long productId,
        Integer quantity
) {
}
