package dev.cauegallizzi.backend.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectDto {
    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Your project title must be between 2 and 100 characters long")
    private String title;

    private String description;
}
