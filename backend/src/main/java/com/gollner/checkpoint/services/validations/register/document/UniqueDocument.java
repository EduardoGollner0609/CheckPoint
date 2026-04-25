package com.gollner.checkpoint.services.validations.register.document;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Constraint(validatedBy = UniqueDocumentValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface UniqueDocument {

    String message() default "Validation error";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
