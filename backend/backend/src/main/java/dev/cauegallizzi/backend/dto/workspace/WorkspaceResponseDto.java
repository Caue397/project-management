package dev.cauegallizzi.backend.dto.workspace;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceResponseDto {
    private UUID id;
    private String name;
    private String slug;
    private UUID ownerId;
}
