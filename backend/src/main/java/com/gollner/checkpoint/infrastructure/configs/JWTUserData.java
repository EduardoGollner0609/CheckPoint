package com.gollner.checkpoint.infrastructure.configs;

public record JWTUserData(
        String userId,
        String email,
        String role
) {}