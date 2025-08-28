package com.auth_service.service;

import com.auth_service.dto.AddressDto;
import com.auth_service.dto.AddressResponse;
import com.auth_service.entity.User;
import com.auth_service.entity.UserAddress;
import com.auth_service.repository.UserAddressRepository;
import com.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final UserRepository userRepository;
    private final UserAddressRepository addressRepository;
    private final EmailPublisher emailPublisher;

    @Transactional(readOnly = true)
    public List<AddressResponse> list(UUID userId) {
        return addressRepository.findActiveByUserId(userId).stream().map(AddressService::mapToDto).toList();
    }

    @Transactional
    public AddressResponse create(UUID userId, AddressDto dto) {
        User user = userRepository.findActiveById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.isDefault()) {
            addressRepository.clearDefaults(userId);
        }

        UserAddress address = UserAddress.builder()
                .user(user)
                .type(UserAddress.AddressType.valueOf(dto.getType().toUpperCase()))
                .recipientName(dto.getRecipientName())
                .phone(dto.getPhone())
                .country(dto.getCountry())
                .state(dto.getState())
                .city(dto.getCity())
                .postalCode(dto.getPostalCode())
                .streetLine1(dto.getStreetLine1())
                .streetLine2(dto.getStreetLine2())
                .isDefault(dto.isDefault())
                .isDeleted(false)
                .build();

        address = addressRepository.save(address);
        AddressResponse response = mapToDto(address);
        // Send email
        emailPublisher.publishEmail(java.util.Map.of(
                "to", user.getEmail(),
                "subject", "Yeni adres kaydedildi",
                "html", EmailTemplates.addressSaved(user.getName(), dto.getCity(), dto.getStreetLine1())
        ));
        return response;
    }

    @Transactional
    public AddressResponse update(UUID userId, UUID addressId, AddressDto dto) {
        UserAddress address = addressRepository.findActiveByUserIdAndId(userId, addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (dto.isDefault()) {
            addressRepository.clearDefaults(userId);
        }

        address.setType(UserAddress.AddressType.valueOf(dto.getType().toUpperCase()));
        address.setRecipientName(dto.getRecipientName());
        address.setPhone(dto.getPhone());
        address.setCountry(dto.getCountry());
        address.setState(dto.getState());
        address.setCity(dto.getCity());
        address.setPostalCode(dto.getPostalCode());
        address.setStreetLine1(dto.getStreetLine1());
        address.setStreetLine2(dto.getStreetLine2());
        address.setDefault(dto.isDefault());

        AddressResponse response = mapToDto(addressRepository.save(address));
        // Send email
        emailPublisher.publishEmail(java.util.Map.of(
                "to", address.getUser().getEmail(),
                "subject", "Adresin güncellendi",
                "html", EmailTemplates.addressSaved(address.getUser().getName(), address.getCity(), address.getStreetLine1())
        ));
        return response;
    }

    @Transactional
    public void delete(UUID userId, UUID addressId) {
        addressRepository.softDelete(userId, addressId);
    }

    private static AddressResponse mapToDto(UserAddress a) {
        return AddressResponse.builder()
                .id(a.getId())
                .type(a.getType().name())
                .recipientName(a.getRecipientName())
                .phone(a.getPhone())
                .country(a.getCountry())
                .state(a.getState())
                .city(a.getCity())
                .postalCode(a.getPostalCode())
                .streetLine1(a.getStreetLine1())
                .streetLine2(a.getStreetLine2())
                .isDefault(a.isDefault())
                .build();
    }
}


