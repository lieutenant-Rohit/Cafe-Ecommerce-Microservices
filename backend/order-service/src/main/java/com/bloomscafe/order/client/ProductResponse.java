package com.bloomscafe.order.client;

public record ProductResponse(
        Long id,
        String name,
        Double price
) {
}
