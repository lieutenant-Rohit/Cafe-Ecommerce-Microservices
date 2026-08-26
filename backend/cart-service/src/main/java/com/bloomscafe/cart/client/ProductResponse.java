package com.bloomscafe.cart.client;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        BigDecimal price,
        Integer stockQuantity,
        String imageUrl,
        CategoryResponse category
) {
    public record CategoryResponse(Long id, String name) {}
}
