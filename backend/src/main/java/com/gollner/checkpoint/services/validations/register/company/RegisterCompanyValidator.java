package com.gollner.checkpoint.services.validations.register.company;

import com.gollner.checkpoint.dto.auth.request.RegisterCompanyDTO;
import com.gollner.checkpoint.entities.exceptions.FieldMessage;
import com.gollner.checkpoint.repository.CompanyRepository;
import com.gollner.checkpoint.repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.ArrayList;
import java.util.List;

public class RegisterCompanyValidator implements ConstraintValidator<RegisterCompanyValid, RegisterCompanyDTO> {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public RegisterCompanyValidator(CompanyRepository companyRepository, UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void initialize(RegisterCompanyValid constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(RegisterCompanyDTO value, ConstraintValidatorContext context) {
        List<FieldMessage> list = new ArrayList<>();

        if (companyRepository.existsByDocument(value.document())) {
            list.add(new FieldMessage("document", "CNPJ já cadastrado"));
        }

        if (userRepository.existsByEmail(value.email())) {
            list.add(new FieldMessage("email", "Este email já está em uso"));
        }

        for (FieldMessage e : list) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(e.getMessage()).addPropertyNode(e.getFieldName())
                    .addConstraintViolation();
        }

        return list.isEmpty();
    }
}
