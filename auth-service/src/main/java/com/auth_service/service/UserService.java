package com.auth_service.service;

import com.auth_service.dto.*;
import com.auth_service.entity.User;
import com.auth_service.repository.UserRepository;
import com.auth_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmailAndIsDeletedFalse(request.getEmail())) {
            throw new RuntimeException("User with email already exists");
        }
        
        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .roles(new String[]{"USER"})
                .build();
        
        user = userRepository.save(user);
        
        // Generate tokens
        String jwt = jwtUtil.generateToken(user.getId(), user.getEmail(), Arrays.asList(user.getRoles()));
        String refresh = jwtUtil.generateRefreshToken(user.getId());
        
        return AuthResponse.builder()
                .id(user.getId())
                .jwt(jwt)
                .refresh(refresh)
                .build();
    }
    
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailAndIsDeletedFalse(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // Generate tokens
        String jwt = jwtUtil.generateToken(user.getId(), user.getEmail(), Arrays.asList(user.getRoles()));
        String refresh = jwtUtil.generateRefreshToken(user.getId());
        
        return AuthResponse.builder()
                .id(user.getId())
                .jwt(jwt)
                .refresh(refresh)
                .build();
    }
    
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findActiveById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .roles(Arrays.asList(user.getRoles()))
                .createdAt(user.getCreatedAt())
                .build();
    }
    
    @Transactional(readOnly = true)
    public Page<UserResponse> getUsers(String role, String query, Pageable pageable) {
        Page<User> users;
        
        if (role != null && !role.isEmpty()) {
            users = userRepository.findByRole(role, pageable);
        } else if (query != null && !query.isEmpty()) {
            users = userRepository.searchUsers(query, pageable);
        } else {
            users = userRepository.findAllActive(pageable);
        }
        
        return users.map(user -> UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .roles(Arrays.asList(user.getRoles()))
                .createdAt(user.getCreatedAt())
                .build());
    }
    
    @Transactional
    public void deleteUser(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        
        userRepository.softDeleteAndAnonymize(userId);
    }
    
    @Transactional
    public void updateUserRoles(UUID userId, List<String> roles) {
        User user = userRepository.findActiveById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setRoles(roles.toArray(new String[0]));
        userRepository.save(user);
    }
}
