package com.bloomscafe.users.dto;

public record LoginResponse(
        String token,
        Long userId,
        String email,
        String role) {
}
