package com.auth_service.dto;

import lombok.Data;

@Data
public class GoogleAuthRequest {
    private String idToken;
    private boolean isRegistration;
}
