package com.gollner.checkpoint.services;

import com.gollner.checkpoint.entities.enums.Role;
import com.gollner.checkpoint.repository.CompanyRepository;
import com.gollner.checkpoint.repository.UserRepository;
import com.gollner.checkpoint.dto.auth.request.RegisterResponseDTO;
import com.gollner.checkpoint.dto.auth.response.RegisterUserDTO;
import com.gollner.checkpoint.entities.Company;
import com.gollner.checkpoint.entities.User;

import org.springframework.stereotype.Service;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyService(CompanyRepository companyRepository,
                          UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    public RegisterResponseDTO register(RegisterUserDTO dto) {

        Company company = companyRepository.findByCode(dto.companyCode())
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        user.setDocument(dto.document());
        user.setCompany(company);
        user.setRole(Role.OPERATOR);

        user = userRepository.save(user);

        return new RegisterResponseDTO(user.getId());
    }
}