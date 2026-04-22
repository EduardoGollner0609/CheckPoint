package com.gollner.checkpoint.dto.auth.request;

public record RegisterCompanyDTO(
        String name,
        String document,
        String email,
        String password
) {}