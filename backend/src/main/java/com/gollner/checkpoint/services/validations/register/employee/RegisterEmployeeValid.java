package com.gollner.checkpoint.services.validations.register.employee;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = RegisterEmployeeValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)

public @interface RegisterEmployeeValid {
    String message() default "Validation error";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}