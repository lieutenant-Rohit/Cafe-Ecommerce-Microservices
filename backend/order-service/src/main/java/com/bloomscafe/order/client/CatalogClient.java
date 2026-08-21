package com.bloomscafe.order.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class CatalogClient {

    private final RestClient restClient;

    public CatalogClient(RestClient.Builder builder) {
        this.restClient = builder
                .baseUrl("http://localhost:8082")
                .build();
    }

    public ProductResponse getProduct(Long productId) {

        return restClient
                .get()
                .uri("/api/products/{id}", productId)
                .retrieve()
                .body(ProductResponse.class);
    }
}