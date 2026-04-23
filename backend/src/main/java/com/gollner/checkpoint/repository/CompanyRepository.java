package com.gollner.checkpoint.repository;

import com.gollner.checkpoint.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CompanyRepository extends JpaRepository<Company, UUID> {
    Optional<Company> findByCodeIgnoreCase(String code);

    boolean existsByDocument(String document);

    boolean existsByCode(String code);
}
