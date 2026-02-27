package dev.cauegallizzi.backend.service;

import dev.cauegallizzi.backend.dto.auth.SessionResponseDto;
import dev.cauegallizzi.backend.dto.auth.SignInDto;
import dev.cauegallizzi.backend.dto.auth.SignUpDto;
import dev.cauegallizzi.backend.entity.User;
import dev.cauegallizzi.backend.repository.UserRepository;
import dev.cauegallizzi.backend.util.CookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepo;
    private final JwtService jwt;
    private final PasswordEncoder passwordEncoder;
    private final CookieUtil cookieUtil;

    public AuthService(UserRepository userRepo, JwtService jwt, PasswordEncoder passwordEncoder, CookieUtil cookieUtil) {
        this.userRepo = userRepo;
        this.jwt = jwt;
        this.passwordEncoder = passwordEncoder;
        this.cookieUtil = cookieUtil;
    }

    public ResponseEntity<SessionResponseDto> session(User user) {
        SessionResponseDto response = new SessionResponseDto(user.getUserId(), user.getName(), user.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public ResponseEntity<?> signUp(SignUpDto dto) {
        if (userRepo.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        }

        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        User newUser = new User(dto.getName(), dto.getEmail(), hashedPassword);

        userRepo.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<?> signIn(SignInDto dto, HttpServletResponse response) {
        User user = userRepo.findByEmail(dto.getEmail()).orElse(null);

        System.out.println("user " + user);
        System.out.println("email " + dto.getEmail());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
        }

        boolean passwordMatches = passwordEncoder.matches(dto.getPassword(), user.getPassword());

        System.out.println("password matches " + passwordMatches);

        if (!passwordMatches) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
        }

        String token = jwt.generateToken(dto.getEmail());

        cookieUtil.createAuthCookie(response, token);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public ResponseEntity<?> signOut(HttpServletResponse response) {
        cookieUtil.deleteAuthCookie(response);
        SecurityContextHolder.clearContext();
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
