package dev.cauegallizzi.backend.service;

import dev.cauegallizzi.backend.dto.SignUpDto;
import dev.cauegallizzi.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepo;

    public AuthService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public void signUp(SignUpDto dto) {
        log.info("Email: {}", dto.getEmail());
        log.info("Name: {}", dto.getName());
        log.info("Password: {}", dto.getPassword());
    }
}
