package dev.cauegallizzi.backend.dto.issue;

import dev.cauegallizzi.backend.entity.enums.IssueStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueResponseDto {
    private UUID id;
    private String title;
    private String description;
    private IssueStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
