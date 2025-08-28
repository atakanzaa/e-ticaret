package com.auth_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddressDto {
    @NotNull
    private String type; // SHIPPING or BILLING

    @NotBlank
    private String recipientName;

    private String phone;

    @NotBlank
    private String country;

    private String state;

    @NotBlank
    private String city;

    @NotBlank
    private String postalCode;

    @NotBlank
    private String streetLine1;

    private String streetLine2;

    private boolean isDefault;
}


