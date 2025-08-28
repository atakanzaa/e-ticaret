package com.auth_service.security;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
public class JwtUtil {
    
    private final RsaKeyProvider rsaKeyProvider;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    @Value("${jwt.kid:auth-rs256-1}")
    private String keyId;

    public JwtUtil(RsaKeyProvider rsaKeyProvider) {
        this.rsaKeyProvider = rsaKeyProvider;
    }
    
    public String generateToken(UUID userId, String email, List<String> roles) {
        try {
            JWSSigner signer = new RSASSASigner(rsaKeyProvider.getPrivateKey());
            
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(userId.toString())
                    .claim("email", email)
                    .claim("roles", roles)
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + expiration))
                    .build();
            
            JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256)
                    .type(JOSEObjectType.JWT)
                    .keyID(keyId)
                    .build();
            SignedJWT signedJWT = new SignedJWT(header, claimsSet);
            signedJWT.sign(signer);
            
            return signedJWT.serialize();
        } catch (JOSEException e) {
            log.error("Error generating JWT token", e);
            throw new RuntimeException("Error generating JWT token", e);
        }
    }
    
    public String generateRefreshToken(UUID userId) {
        try {
            JWSSigner signer = new RSASSASigner(rsaKeyProvider.getPrivateKey());
            
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(userId.toString())
                    .claim("type", "refresh")
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + refreshExpiration))
                    .build();
            
            JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256)
                    .type(JOSEObjectType.JWT)
                    .keyID(keyId)
                    .build();
            SignedJWT signedJWT = new SignedJWT(header, claimsSet);
            signedJWT.sign(signer);
            
            return signedJWT.serialize();
        } catch (JOSEException e) {
            log.error("Error generating refresh token", e);
            throw new RuntimeException("Error generating refresh token", e);
        }
    }
    
    public boolean validateToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new RSASSAVerifier(rsaKeyProvider.getPublicKey());
            
            if (!signedJWT.verify(verifier)) {
                return false;
            }
            
            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            return expirationTime != null && expirationTime.after(new Date());
        } catch (ParseException | JOSEException e) {
            log.error("Error validating token", e);
            return false;
        }
    }
    
    public UUID getUserIdFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return UUID.fromString(signedJWT.getJWTClaimsSet().getSubject());
        } catch (ParseException e) {
            log.error("Error extracting user ID from token", e);
            throw new RuntimeException("Error extracting user ID from token", e);
        }
    }
    
    public String getEmailFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getStringClaim("email");
        } catch (ParseException e) {
            log.error("Error extracting email from token", e);
            throw new RuntimeException("Error extracting email from token", e);
        }
    }
    
    @SuppressWarnings("unchecked")
    public List<String> getRolesFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return (List<String>) signedJWT.getJWTClaimsSet().getClaim("roles");
        } catch (ParseException e) {
            log.error("Error extracting roles from token", e);
            throw new RuntimeException("Error extracting roles from token", e);
        }
    }
}
