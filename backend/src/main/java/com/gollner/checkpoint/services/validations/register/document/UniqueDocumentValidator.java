package com.gollner.checkpoint.services.validations.register.document;

import com.gollner.checkpoint.repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class UniqueDocumentValidator implements ConstraintValidator<UniqueDocument, String> {

    private final UserRepository userRepository;

    public UniqueDocumentValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean isValid(String document, ConstraintValidatorContext context) {

        boolean exists = userRepository.existsByDocument(document);

        return !exists;
    }
}