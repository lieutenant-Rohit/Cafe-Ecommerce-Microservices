package com.bloomscafe.order.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class CartClient {

    private final RestClient restClient;

    public CartClient(
            RestClient.Builder builder,
            @Value("${cart.service.url:http://localhost:8083}") String baseUrl) {
        this.restClient = builder
                .baseUrl(baseUrl)
                .build();
    }

    public CartResponse getCart(Long userId) {

        return restClient
                .get()
                .uri("/api/carts/user/{userId}", userId)
                .header("Authorization", currentBearerToken())
                .retrieve()
                .body(CartResponse.class);
    }

    private String currentBearerToken() {

        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes != null) {

            String authHeader =
                    attributes.getRequest().getHeader("Authorization");

            if (authHeader != null &&
                    authHeader.startsWith("Bearer ")) {

                return authHeader;
            }
        }

        throw new IllegalStateException(
                "Missing Authorization header for downstream cart call"
        );
    }
}
