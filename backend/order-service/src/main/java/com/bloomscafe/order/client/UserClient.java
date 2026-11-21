package com.bloomscafe.order.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class UserClient {

    private final RestClient restClient;

    public UserClient(
            RestClient.Builder builder,
            @Value("${user.service.url:http://localhost:8081}") String baseUrl) {
        this.restClient = builder
                .baseUrl(baseUrl)
                .build();
    }

    public UserResponse getCurrentUser() {

        return restClient
                .get()
                .uri("/api/users/me")
                .header("Authorization", currentBearerToken())
                .retrieve()
                .body(UserResponse.class);
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
                "Missing Authorization header for downstream user call"
        );
    }

    public record UserResponse(
            Long id,
            String name,
            String email,
            String role
    ) {
    }
}
