package com.gollner.checkpoint.dto.auth.request;

import com.gollner.checkpoint.services.validations.register.company.RegisterCompanyValid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CNPJ;

@RegisterCompanyValid
public record RegisterCompanyDTO(
        @NotBlank(message = "O nome é obrigatório")
        @Size(min = 4, max = 70, message = "O nome deve ter entre 4 e 70 caracteres")
        String name,
        @NotBlank(message = "Documento é obrigatório")
        @CNPJ(message = "CNPJ inválido")
        String document,
        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        String email,
        @NotBlank(message = "Senha obrigatória")
        @Size(min = 6, message = "A senha deve conter no minímo 6 caracteres")
        String password
) {
}