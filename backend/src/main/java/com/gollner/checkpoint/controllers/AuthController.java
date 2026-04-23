package com.gollner.checkpoint.controllers;

import com.gollner.checkpoint.dto.auth.request.LoginRequestDTO;
import com.gollner.checkpoint.dto.auth.response.LoginResponseDTO;
import com.gollner.checkpoint.entities.User;
import com.gollner.checkpoint.services.AuthService;
import com.gollner.checkpoint.services.TokenService;
import com.gollner.checkpoint.services.UserService;
import com.gollner.checkpoint.services.CompanyService;
import com.gollner.checkpoint.dto.auth.request.RegisterCompanyDTO;
import com.gollner.checkpoint.dto.auth.response.RegisterResponseDTO;
import com.gollner.checkpoint.dto.auth.request.RegisterUserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final CompanyService companyService;
    private final AuthService authService;

    public AuthController(UserService userService,
                          CompanyService companyService,
                          AuthService authService) {
        this.userService = userService;
        this.companyService = companyService;
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        LoginResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/company")
    public ResponseEntity<RegisterResponseDTO> registerCompany(@RequestBody RegisterCompanyDTO dto) {

        RegisterResponseDTO response = companyService.register(dto);

        URI location = URI.create("/auth/companies/" + response.userId());

        return ResponseEntity
                .created(location)
                .body(response);
    }

    @PostMapping("/register/user")
    public ResponseEntity<RegisterResponseDTO> registerUser(@RequestBody RegisterUserDTO dto) {

        RegisterResponseDTO response = userService.register(dto);

        URI location = URI.create("/auth/users/" + response.userId());

        return ResponseEntity
                .created(location)
                .body(response);
    }
}