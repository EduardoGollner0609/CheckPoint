package com.gollner.checkpoint.controllers;

import com.gollner.checkpoint.services.UserService;
import com.gollner.checkpoint.services.CompanyService;
import com.gollner.checkpoint.dto.auth.request.RegisterCompanyDTO;
import com.gollner.checkpoint.dto.auth.request.RegisterResponseDTO;
import com.gollner.checkpoint.dto.auth.response.RegisterUserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final CompanyService companyService;

    public AuthController(UserService userService,
                          CompanyService companyService) {
        this.userService = userService;
        this.companyService = companyService;
    }

    @PostMapping("/register/company")
    public ResponseEntity<RegisterResponseDTO> registerCompany(@RequestBody RegisterCompanyDTO dto) {

        RegisterResponseDTO response = userService.register(dto);

        URI location = URI.create("/auth/companies/" + response.userId());

        return ResponseEntity
                .created(location)
                .body(response);
    }

    @PostMapping("/register/user")
    public ResponseEntity<RegisterResponseDTO> registerUser(@RequestBody RegisterUserDTO dto) {

        RegisterResponseDTO response = companyService.register(dto);

        URI location = URI.create("/auth/users/" + response.userId());

        return ResponseEntity
                .created(location)
                .body(response);
    }
}