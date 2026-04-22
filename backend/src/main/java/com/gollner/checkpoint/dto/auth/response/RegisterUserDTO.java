package com.gollner.checkpoint.dto.auth.response;

public record RegisterUserDTO(
        String name,
        String document,
        String email,
        String password,
        String companyCode
) {}