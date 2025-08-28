package com.auth_service.security;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Component
public class RsaKeyProvider {

    @Getter
    private final RSAPublicKey publicKey;

    @Getter
    private final RSAPrivateKey privateKey;

    @Getter
    private final String keyId;

    public RsaKeyProvider(@Value("${jwt.kid:auth-rs256-1}") String keyId) {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            KeyPair keyPair = generator.generateKeyPair();
            this.publicKey = (RSAPublicKey) keyPair.getPublic();
            this.privateKey = (RSAPrivateKey) keyPair.getPrivate();
            this.keyId = keyId;
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Unable to initialize RSA key pair", e);
        }
    }
}


