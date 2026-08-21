package com.bloomscafe.order.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class CartClient {

    private final RestClient restClient;

    public CartClient(RestClient.Builder builder) {
        this.restClient = builder
                .baseUrl("http://localhost:8083")
                .build();
    }

    public CartResponse getCart(Long userId) {

        return restClient
                .get()
                .uri("/api/carts/user/{userId}", userId)
                .retrieve()
                .body(CartResponse.class);
    }
}