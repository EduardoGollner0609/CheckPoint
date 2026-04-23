package com.gollner.checkpoint.services;

import com.gollner.checkpoint.dto.auth.request.RegisterUserDTO;
import com.gollner.checkpoint.entities.enums.Role;
import com.gollner.checkpoint.dto.auth.request.RegisterCompanyDTO;
import com.gollner.checkpoint.entities.Company;
import com.gollner.checkpoint.entities.User;
import com.gollner.checkpoint.repository.CompanyRepository;
import com.gollner.checkpoint.repository.UserRepository;
import com.gollner.checkpoint.dto.auth.response.RegisterResponseDTO;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(CompanyRepository companyRepository,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterResponseDTO register(RegisterUserDTO dto) {
        Company company = companyRepository.findByCode(dto.companyCode())
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setDocument(dto.document());
        user.setCompany(company);
        user.setRole(Role.ROLE_OPERATOR);

        user = userRepository.save(user);

        return new RegisterResponseDTO(user.getId());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findUserByEmail(username)
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));
    }
}