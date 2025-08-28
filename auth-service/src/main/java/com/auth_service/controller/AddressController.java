package com.auth_service.controller;

import com.auth_service.dto.AddressDto;
import com.auth_service.dto.AddressResponse;
import com.auth_service.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/addresses")
public class AddressController {

    private final AddressService addressService;

    private static UUID requireUserId(String header) {
        if (header == null || header.isBlank()) {
            throw new IllegalArgumentException("X-User-Id header required");
        }
        return UUID.fromString(header);
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> list(@RequestHeader("X-User-Id") String userIdHeader) {
        UUID userId = requireUserId(userIdHeader);
        return ResponseEntity.ok(addressService.list(userId));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> create(
            @RequestHeader("X-User-Id") String userIdHeader,
            @Valid @RequestBody AddressDto dto
    ) {
        UUID userId = requireUserId(userIdHeader);
        return ResponseEntity.ok(addressService.create(userId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> update(
            @RequestHeader("X-User-Id") String userIdHeader,
            @PathVariable("id") UUID addressId,
            @Valid @RequestBody AddressDto dto
    ) {
        UUID userId = requireUserId(userIdHeader);
        return ResponseEntity.ok(addressService.update(userId, addressId, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader("X-User-Id") String userIdHeader,
            @PathVariable("id") UUID addressId
    ) {
        UUID userId = requireUserId(userIdHeader);
        addressService.delete(userId, addressId);
        return ResponseEntity.noContent().build();
    }
}


