package dev.cauegallizzi.backend.util;

import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CookieUtil {

    @Value("${jwt.cookie.name}")
    private String cookieName;

    @Value("${jwt.cookie.expiration}")
    private int expiration;

    @Value("${jwt.cookie.secure}")
    private boolean cookieSecure;

    public String extractToken(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals(cookieName)) {
                return cookie.getValue();
            }
        }

        return null;
    }

    public void createAuthCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(expiration)
                .sameSite(cookieSecure ? "None" : "Lax")
                .build();
        System.out.println("[CookieUtil] createAuthCookie -> name=" + cookieName + " secure=" + cookieSecure + " maxAge=" + expiration + " header=" + cookie.toString());
        response.addHeader("Set-Cookie", cookie.toString());
    }

    public void deleteAuthCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(0)
                .sameSite(cookieSecure ? "None" : "Lax")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }
}
