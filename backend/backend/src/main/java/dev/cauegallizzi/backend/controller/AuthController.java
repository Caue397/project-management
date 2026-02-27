package dev.cauegallizzi.backend.controller;

import dev.cauegallizzi.backend.dto.auth.SessionResponseDto;
import dev.cauegallizzi.backend.dto.auth.SignInDto;
import dev.cauegallizzi.backend.dto.auth.SignUpDto;
import dev.cauegallizzi.backend.entity.User;
import dev.cauegallizzi.backend.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @GetMapping("/session")
    public ResponseEntity<SessionResponseDto> session(@AuthenticationPrincipal User user) {
        return authService.session(user);
    }

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody @Valid SignUpDto dto) {
        return authService.signUp(dto);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> signIn(@RequestBody @Valid SignInDto dto, HttpServletResponse response) {
        return authService.signIn(dto, response);
    }

    @PostMapping("/sign-out")
    public ResponseEntity<?> signOut(HttpServletResponse response) {
        return authService.signOut(response);
    }
}
