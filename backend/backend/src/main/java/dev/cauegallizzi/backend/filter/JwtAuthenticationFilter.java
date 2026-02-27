package dev.cauegallizzi.backend.filter;

import dev.cauegallizzi.backend.entity.User;
import dev.cauegallizzi.backend.repository.UserRepository;
import dev.cauegallizzi.backend.service.JwtService;
import dev.cauegallizzi.backend.util.CookieUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepo;
    private final CookieUtil cookieUtil;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepo, CookieUtil cookieUtil) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
        this.cookieUtil = cookieUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = cookieUtil.extractToken(request);

        System.out.println(token);

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String email = jwtService.extractEmail(token);

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            User user = userRepo.findByEmail(email).orElse(null);

            if (user != null && jwtService.isTokenValid(token)) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
