package dev.cauegallizzi.backend.dto.project;

import dev.cauegallizzi.backend.entity.enums.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponseDto {
    private UUID id;
    private String title;
    private String description;
    private String content;
    private ProjectStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
