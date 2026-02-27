package dev.cauegallizzi.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionResponseDto {
    private UUID userId;
    private String name;
    private String email;
}
