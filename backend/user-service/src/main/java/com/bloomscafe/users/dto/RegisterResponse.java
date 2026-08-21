package com.bloomscafe.users.dto;

public record RegisterResponse(
        Long id,
        String name,
        String email,
        String role) {
}
