package com.gollner.checkpoint.services;

import com.gollner.checkpoint.dto.auth.request.login.LoginRequestDTO;
import com.gollner.checkpoint.dto.auth.request.register.RegisterCompanyDTO;
import com.gollner.checkpoint.dto.auth.request.register.RegisterEmployeeDTO;
import com.gollner.checkpoint.dto.auth.request.register.RegisterSelfEmployedDTO;
import com.gollner.checkpoint.dto.auth.response.login.LoginResponseDTO;
import com.gollner.checkpoint.dto.auth.response.register.RegisterResponseDTO;
import com.gollner.checkpoint.entities.Company;
import com.gollner.checkpoint.entities.User;
import com.gollner.checkpoint.entities.enums.Role;
import com.gollner.checkpoint.repository.CompanyRepository;
import com.gollner.checkpoint.repository.UserRepository;
import com.gollner.checkpoint.services.exceptions.ResourceNotFoundException;
import com.gollner.checkpoint.services.exceptions.UnauthorizedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;
@Service
public class AuthService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            CompanyRepository companyRepository,
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            TokenService tokenService,
            PasswordEncoder passwordEncoder
    ) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
        try {
            var authToken = new UsernamePasswordAuthenticationToken(dto.email(), dto.password());
            var authentication = authenticationManager.authenticate(authToken);

            User user = (User) authentication.getPrincipal();

            return new LoginResponseDTO(tokenService.generateToken(user));

        } catch (AuthenticationException e) {
            throw new UnauthorizedException("Credenciais inválidas");
        }
    }

    public RegisterResponseDTO registerCompany(RegisterCompanyDTO dto) {
        Company company = new Company();
        company.setName(dto.name());
        company.setDocument(dto.document());
        company.setCode(generateUniqueCode());

        company = companyRepository.save(company);

        User user = createUser(dto.name(), dto.email(), dto.password(), dto.document(), Role.ROLE_ADMIN, company);

        return new RegisterResponseDTO(user.getId());
    }

    public RegisterResponseDTO registerEmployee(RegisterEmployeeDTO dto) {
        Company company = companyRepository.findByCodeIgnoreCase(dto.companyCode())
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada"));

        User user = createUser(dto.name(), dto.email(), dto.password(), dto.document(), Role.ROLE_EMPLOYEE, company);

        return new RegisterResponseDTO(user.getId());
    }

    public RegisterResponseDTO registerSelfEmployed(RegisterSelfEmployedDTO dto) {
        User user = createUser(dto.name(), dto.email(), dto.password(), dto.document(), Role.ROLE_SELF_EMPLOYED, null);

        return new RegisterResponseDTO(user.getId());
    }

    private User createUser(String name, String email, String rawPassword, String document, Role role, Company company) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setDocument(document);
        user.setRole(role);
        user.setCompany(company);

        return userRepository.save(user);
    }

    private String generateUniqueCode() {
        String code;
        do {
            code = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        } while (companyRepository.existsByCode(code));

        return code;
    }
}