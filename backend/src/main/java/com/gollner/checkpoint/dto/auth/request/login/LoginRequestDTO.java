package com.gollner.checkpoint.dto.auth.request.login;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequestDTO(@NotBlank(message = "Email é obrigatório")
                              @Email(message = "Email inválido")
                              String email,
                              @NotBlank(message = "Senha obrigatória")
                              @Size(min = 6, message = "Senha inválida")
                              String password) {
}
