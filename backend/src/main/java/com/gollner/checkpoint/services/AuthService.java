package com.gollner.checkpoint.services;

import com.gollner.checkpoint.dto.auth.request.LoginRequestDTO;
import com.gollner.checkpoint.dto.auth.response.LoginResponseDTO;
import com.gollner.checkpoint.entities.User;
import com.gollner.checkpoint.services.exceptions.UnauthorizedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthService(AuthenticationManager authenticationManager,
                       TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        try {
            var auth = new UsernamePasswordAuthenticationToken(loginRequestDTO.email(), loginRequestDTO.password());

            var authentication = authenticationManager.authenticate(auth);

            User user = (User) authentication.getPrincipal();

            return new LoginResponseDTO(tokenService.generateToken(user));
        }
        catch(AuthenticationException e) {
            throw new UnauthorizedException("Credenciais inválidas");
        }
    }
}