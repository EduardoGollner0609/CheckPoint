package com.gollner.checkpoint.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.gollner.checkpoint.entities.User;
import com.gollner.checkpoint.infrastructure.configs.JWTUserData;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class TokenService {

    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(User user) {
        return JWT.create()
                .withSubject(user.getEmail())
                .withClaim("userId", user.getId().toString())
                .withClaim("role", user.getRole().name())
                .withClaim("companyId", user.getCompany().getId().toString())
                .withIssuedAt(Instant.now())
                .withExpiresAt(Instant.now().plusSeconds(86400))
                .sign(Algorithm.HMAC256(secret));
    }

    public Optional<JWTUserData> validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            DecodedJWT decode = JWT.require(algorithm).build().verify(token);

            return Optional.of(new JWTUserData(
                    decode.getClaim("userId").asString(),
                    decode.getSubject(),
                    decode.getClaim("role").asString(),
                    decode.getClaim("companyId").asString()
            ));
        } catch (JWTVerificationException ex) {
            return Optional.empty();
        }

    }
}