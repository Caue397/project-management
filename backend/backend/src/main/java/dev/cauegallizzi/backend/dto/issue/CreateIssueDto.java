package dev.cauegallizzi.backend.dto.issue;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateIssueDto {
    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Your issue title must be between 2 and 100 characters long")
    private String title;

    private String description;
}
