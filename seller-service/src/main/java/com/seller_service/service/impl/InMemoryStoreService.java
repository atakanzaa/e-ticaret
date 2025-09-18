package com.seller_service.service.impl;

import com.seller_service.service.AuthServiceClient;
import com.seller_service.service.StoreService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class InMemoryStoreService implements StoreService {

    private final Map<UUID, Map<String, Object>> applications = new ConcurrentHashMap<>();
    private final Map<UUID, Map<String, Object>> stores = new ConcurrentHashMap<>();
    private final AuthServiceClient authServiceClient;

    public InMemoryStoreService(AuthServiceClient authServiceClient) {
        this.authServiceClient = authServiceClient;
    }

    @Override
    public Map<String, Object> createApplication(UUID userId) {
        UUID id = UUID.randomUUID();
        Map<String, Object> app = new HashMap<>();
        app.put("id", id);
        app.put("userId", userId);
        app.put("status", "PENDING");
        applications.put(id, app);
        return app;
    }

    @Override
    public List<Map<String, Object>> listApplications() {
        return new ArrayList<>(applications.values());
    }

    @Override
    public Optional<Map<String, Object>> updateStatus(UUID id, String status) {
        Map<String, Object> app = applications.get(id);
        if (app == null) return Optional.empty();
        app.put("status", status);
        // On approve, promote user to SELLER role as well
        if ("APPROVED".equalsIgnoreCase(status)) {
            UUID userId = (UUID) app.get("userId");
            if (userId != null) {
                authServiceClient.setUserSellerRole(userId);
            }
        }
        return Optional.of(app);
    }

    @Override
    public Map<String, Object> myStore(UUID userId) {
        return stores.computeIfAbsent(userId, uid -> {
            Map<String, Object> s = new HashMap<>();
            s.put("id", UUID.randomUUID());
            s.put("ownerUserId", uid);
            s.put("name", "My Store");
            s.put("bio", "About my store");
            s.put("isApproved", true);
            return s;
        });
    }

    @Override
    public Map<String, Object> updateProfile(UUID userId, Map<String, Object> body) {
        Map<String, Object> store = myStore(userId);
        store.putAll(body);
        return store;
    }
}


