package com.auth_service.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AddressResponse {
    private UUID id;
    private String type;
    private String recipientName;
    private String phone;
    private String country;
    private String state;
    private String city;
    private String postalCode;
    private String streetLine1;
    private String streetLine2;
    private boolean isDefault;
}


