package com.gollner.checkpoint.controllers;

import com.gollner.checkpoint.dto.auth.request.login.LoginRequestDTO;
import com.gollner.checkpoint.dto.auth.request.register.RegisterEmployeeDTO;
import com.gollner.checkpoint.dto.auth.request.register.RegisterSelfEmployedDTO;
import com.gollner.checkpoint.dto.auth.response.login.LoginResponseDTO;
import com.gollner.checkpoint.services.AuthService;
import com.gollner.checkpoint.dto.auth.request.register.RegisterCompanyDTO;
import com.gollner.checkpoint.dto.auth.response.register.RegisterResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        LoginResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/company")
    public ResponseEntity<RegisterResponseDTO> registerCompany(@Valid @RequestBody RegisterCompanyDTO dto) {

        RegisterResponseDTO response = authService.registerCompany(dto);

        URI location = URI.create("/auth/companies/" + response.userId());

        return ResponseEntity
                .created(location)
                .body(response);
    }

    @PostMapping("/register/employee")
    public ResponseEntity<RegisterResponseDTO> registerEmployee(@Valid @RequestBody RegisterEmployeeDTO dto) {

        RegisterResponseDTO response = authService.registerEmployee(dto);

        URI location = URI.create("/auth/users/" + response.userId());

        return ResponseEntity
                .created(location)
                .body(response);
    }

    @PostMapping("/register/self-employed")
    public ResponseEntity<RegisterResponseDTO> registerSelfEmployed(@Valid @RequestBody RegisterSelfEmployedDTO dto) {

        RegisterResponseDTO response = authService.registerSelfEmployed(dto);

        URI location = URI.create("/auth/users/" + response.userId());

        return ResponseEntity
                .created(location)
                .body(response);
    }
}