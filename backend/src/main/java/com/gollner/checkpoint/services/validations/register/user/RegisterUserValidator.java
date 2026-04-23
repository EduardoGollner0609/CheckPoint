package com.gollner.checkpoint.services.validations.register.user;

import com.gollner.checkpoint.dto.auth.request.RegisterUserDTO;
import com.gollner.checkpoint.entities.exceptions.FieldMessage;
import com.gollner.checkpoint.repository.CompanyRepository;
import com.gollner.checkpoint.repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.ArrayList;
import java.util.List;

public class RegisterUserValidator implements ConstraintValidator<RegisterUserValid, RegisterUserDTO> {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public RegisterUserValidator(CompanyRepository companyRepository, UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void initialize(RegisterUserValid constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(RegisterUserDTO value, ConstraintValidatorContext context) {
        List<FieldMessage> list = new ArrayList<>();

        if (userRepository.existsByDocument(value.document())) {
            list.add(new FieldMessage("document", "CPF já cadastrado"));
        }

        if (userRepository.existsByEmail(value.email())) {
            list.add(new FieldMessage("email", "Este email já está em uso"));
        }

        if(!companyRepository.existsByCode(value.companyCode())) {
            list.add(new FieldMessage("companyCode", "Código inválido (nenhuma empresa encontrada para esse código)."));
        }

        for (FieldMessage e : list) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(e.getMessage()).addPropertyNode(e.getFieldName())
                    .addConstraintViolation();
        }

        return list.isEmpty();
    }
}
