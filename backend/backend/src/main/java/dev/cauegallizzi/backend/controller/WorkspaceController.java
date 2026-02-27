package dev.cauegallizzi.backend.controller;

import dev.cauegallizzi.backend.dto.workspace.CreateWorkspaceDto;
import dev.cauegallizzi.backend.dto.workspace.UpdateWorkspaceDto;
import dev.cauegallizzi.backend.dto.workspace.WorkspaceResponseDto;
import dev.cauegallizzi.backend.entity.User;
import dev.cauegallizzi.backend.service.WorkspaceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workspace")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @GetMapping()
    public ResponseEntity<List<WorkspaceResponseDto>> getAll(@AuthenticationPrincipal User user) {
        return workspaceService.getAll(user);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<WorkspaceResponseDto> get(@PathVariable String slug, @AuthenticationPrincipal User user) {
        return workspaceService.get(slug, user);
    }

    @PostMapping()
    public ResponseEntity<?> create(@AuthenticationPrincipal User user, @RequestBody @Valid CreateWorkspaceDto dto) {
        return workspaceService.create(user, dto);
    }

    @PutMapping("/{slug}")
    public ResponseEntity<WorkspaceResponseDto> update(@PathVariable String slug, @RequestBody @Valid UpdateWorkspaceDto dto, @AuthenticationPrincipal User user) {
        return workspaceService.update(slug, dto, user);
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<?> delete(@PathVariable String slug, @AuthenticationPrincipal User user) {
        return workspaceService.delete(slug, user);
    }
}
