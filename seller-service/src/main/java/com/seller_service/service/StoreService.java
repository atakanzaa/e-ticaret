package com.seller_service.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface StoreService {
    Map<String, Object> createApplication(UUID userId);
    List<Map<String, Object>> listApplications();
    Optional<Map<String, Object>> updateStatus(UUID id, String status);
    Map<String, Object> myStore(UUID userId);
    Map<String, Object> updateProfile(UUID userId, Map<String, Object> body);
}


