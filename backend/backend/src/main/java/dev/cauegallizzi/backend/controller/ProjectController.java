package dev.cauegallizzi.backend.controller;

import dev.cauegallizzi.backend.dto.project.CreateProjectDto;
import dev.cauegallizzi.backend.dto.project.ProjectResponseDto;
import dev.cauegallizzi.backend.dto.project.UpdateProjectDto;
import dev.cauegallizzi.backend.entity.User;
import dev.cauegallizzi.backend.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/project")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/{workspaceSlug}")
    public ResponseEntity<List<ProjectResponseDto>> getAll(@PathVariable String workspaceSlug, @AuthenticationPrincipal User user) {
        return projectService.getAll(workspaceSlug, user);
    }

    @GetMapping("/{workspaceSlug}/{projectId}")
    public ResponseEntity<ProjectResponseDto> get(@PathVariable String workspaceSlug, @PathVariable UUID projectId, @AuthenticationPrincipal User user) {
        return projectService.get(workspaceSlug, projectId, user);
    }

    @PostMapping("/{workspaceSlug}")
    public ResponseEntity<?> create(@PathVariable String workspaceSlug, @RequestBody @Valid CreateProjectDto dto, @AuthenticationPrincipal User user) {
        return projectService.create(workspaceSlug, dto, user);
    }

    @PutMapping("/{workspaceSlug}/{projectId}")
    public ResponseEntity<ProjectResponseDto> update(@PathVariable String workspaceSlug, @PathVariable UUID projectId, @RequestBody @Valid UpdateProjectDto dto, @AuthenticationPrincipal User user) {
        return projectService.update(workspaceSlug, projectId, dto, user);
    }

    @DeleteMapping("/{workspaceSlug}/{projectId}")
    public ResponseEntity<?> delete(@PathVariable String workspaceSlug, @PathVariable UUID projectId, @AuthenticationPrincipal User user) {
        return projectService.delete(workspaceSlug, projectId, user);
    }
}
