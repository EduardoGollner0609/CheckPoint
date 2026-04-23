package com.gollner.checkpoint.services;

import com.gollner.checkpoint.dto.auth.request.RegisterCompanyDTO;
import com.gollner.checkpoint.entities.enums.Role;
import com.gollner.checkpoint.repository.CompanyRepository;
import com.gollner.checkpoint.dto.auth.response.RegisterResponseDTO;
import com.gollner.checkpoint.entities.Company;
import com.gollner.checkpoint.entities.User;
import com.gollner.checkpoint.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public CompanyService(CompanyRepository companyRepository,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterResponseDTO register(RegisterCompanyDTO dto) {
        Company company = new Company();
        company.setName(dto.name());
        company.setDocument(dto.document());
        company.setCode(generateCode());

        company = companyRepository.save(company);

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setDocument(dto.document());
        user.setCompany(company);
        user.setRole(Role.ROLE_ADMIN);

        user = userRepository.save(user);

        return new RegisterResponseDTO(user.getId());
    }

    private String generateCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

}