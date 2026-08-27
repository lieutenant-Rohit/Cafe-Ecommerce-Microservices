package com.bloomscafe.order.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class InventoryClient {

    private final RestClient restClient;

    public InventoryClient(
            @Value("${inventory.service.url:http://localhost:8085}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public void reserveStock(
            Long productId,
            Integer quantity) {

        restClient
                .post()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/api/inventory/{productId}/reserve")
                                .queryParam("quantity", quantity)
                                .build(productId)
                )
                .header("Authorization", currentBearerToken())
                .retrieve()
                .toBodilessEntity();
    }
    public void releaseStock(
            Long productId,
            Integer quantity) {

        restClient
                .post()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/api/inventory/{productId}/release")
                                .queryParam("quantity", quantity)
                                .build(productId)
                )
                .header("Authorization", currentBearerToken())
                .retrieve()
                .toBodilessEntity();
    }

    private String currentBearerToken() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            String authHeader =
                    attributes.getRequest().getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                return authHeader;
            }
        }
        throw new IllegalStateException(
                "Missing Authorization header for downstream inventory call"
        );
    }
}