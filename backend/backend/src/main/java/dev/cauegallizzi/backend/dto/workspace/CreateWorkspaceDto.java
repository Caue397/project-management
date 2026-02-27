package dev.cauegallizzi.backend.dto.workspace;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateWorkspaceDto {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Your workspace name must be between 2 and 50 characters long")
    private String name;
}
