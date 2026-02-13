package dev.cauegallizzi.backend.controller;

import dev.cauegallizzi.backend.dto.SignUpDto;
import dev.cauegallizzi.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/sign-up")
    public void signUp(@RequestBody SignUpDto dto) {
        authService.signUp(dto);
    }

    @PostMapping("/sign-in")
    public void login() {

    }

    @DeleteMapping("/sign-out")
    public void logout() {

    }
}
