package com.bloomscafe.cart.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
public class CatalogClient {
    private final RestClient restClient;

    public CatalogClient(
            RestClient.Builder builder,
            @Value("${catalog.service.url:http://localhost:8082}") String baseUrl) {
        this.restClient = builder
                .baseUrl(baseUrl)
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

    public List<ProductResponse> getProductsByIds(List<Long> ids){
        if(ids.isEmpty()){
            return List.of();
        }
        return restClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/products/batch")
                        .queryParam("ids", ids)
                        .build())
                .retrieve()
                .body(new ParameterizedTypeReference<>(){});
    }
}
