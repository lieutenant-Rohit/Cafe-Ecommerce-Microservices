package com.bloomscafe.cart.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class CatalogClient {
    private final RestClient restClient;

    public CatalogClient(RestClient.Builder builder){
        this.restClient = builder
                .baseUrl("http://localhost:8082")
                .build();
    }

    public boolean productExists(Long productId){
        try{
            restClient
                    .get()
                    .uri("/api/products/{id}", productId)
                    .retrieve()
                    .toBodilessEntity();

            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
