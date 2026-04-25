package com.gollner.checkpoint.services.validations.register.employee;

import com.gollner.checkpoint.dto.auth.request.register.RegisterEmployeeDTO;
import com.gollner.checkpoint.entities.exceptions.FieldMessage;
import com.gollner.checkpoint.repository.CompanyRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.ArrayList;
import java.util.List;

public class RegisterEmployeeValidator implements ConstraintValidator<RegisterEmployeeValid, RegisterEmployeeDTO> {

    private final CompanyRepository companyRepository;

    public RegisterEmployeeValidator(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public void initialize(RegisterEmployeeValid constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(RegisterEmployeeDTO value, ConstraintValidatorContext context) {
        List<FieldMessage> list = new ArrayList<>();

        if (!companyRepository.existsByCode(value.companyCode())) {
            list.add(new FieldMessage("companyCode", "Código inválido. (não existe empresa com esse código)"));
        }

        for (FieldMessage e : list) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(e.getMessage()).addPropertyNode(e.getFieldName())
                    .addConstraintViolation();
        }

        return list.isEmpty();
    }
}
