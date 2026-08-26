package com.bloomscafe.cart.dto;

import com.bloomscafe.cart.client.ProductResponse;

import java.util.List;

public record CartResponse(
        Long id,
        Long userId,
        List<CartItemResponse> items
) {
    public record CartItemResponse(
            Long id,
            Long productId,
            Integer quantity,
            ProductResponse product
    ) {}
}
