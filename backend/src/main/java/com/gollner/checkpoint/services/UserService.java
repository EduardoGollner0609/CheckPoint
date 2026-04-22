package com.gollner.checkpoint.services;

import com.gollner.checkpoint.entities.enums.Role;
import com.gollner.checkpoint.dto.auth.request.RegisterCompanyDTO;
import com.gollner.checkpoint.entities.Company;
import com.gollner.checkpoint.entities.User;
import com.gollner.checkpoint.repository.CompanyRepository;
import com.gollner.checkpoint.repository.UserRepository;
import com.gollner.checkpoint.dto.auth.request.RegisterResponseDTO;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public UserService(CompanyRepository companyRepository,
                       UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    public RegisterResponseDTO register(RegisterCompanyDTO dto) {

        if (companyRepository.existsByDocument(dto.document())) {
            throw new RuntimeException("Empresa já cadastrada");
        }

        Company company = new Company();
        company.setName(dto.name());
        company.setDocument(dto.document());
        company.setCode(generateCode());

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setDocument(dto.document());
        user.setPassword(dto.password());
        user.setRole(Role.ADMIN);

        company.addUser(user);

        company = companyRepository.save(company);

        user.setCompany(company);
        user = userRepository.save(user);
        return new RegisterResponseDTO(user.getId());
    }

    private String generateCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}