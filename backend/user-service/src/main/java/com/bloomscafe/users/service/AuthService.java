package com.bloomscafe.users.service;

import com.bloomscafe.users.dto.LoginRequest;
import com.bloomscafe.users.dto.LoginResponse;
import com.bloomscafe.users.dto.RegisterRequest;
import com.bloomscafe.users.dto.RegisterResponse;
import com.bloomscafe.users.entity.Role;
import com.bloomscafe.users.entity.User;
import com.bloomscafe.users.exception.DuplicateEmailException;
import com.bloomscafe.users.exception.InvalidCredentialsException;
import com.bloomscafe.users.repo.UserRepository;
import com.bloomscafe.users.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateEmailException("Email is already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(Role.CUSTOMER);

        User saved = userRepository.save(user);

        return new RegisterResponse(
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getRole().name()
        );
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid Email or Password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new InvalidCredentialsException("Invalid Email or Password");
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return new LoginResponse(token, user.getId(), user.getEmail(), user.getRole().name());
    }
}