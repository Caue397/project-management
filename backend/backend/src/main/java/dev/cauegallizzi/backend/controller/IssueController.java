package dev.cauegallizzi.backend.controller;

import dev.cauegallizzi.backend.dto.issue.CreateIssueDto;
import dev.cauegallizzi.backend.dto.issue.IssueResponseDto;
import dev.cauegallizzi.backend.dto.issue.UpdateIssueDto;
import dev.cauegallizzi.backend.entity.User;
import dev.cauegallizzi.backend.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/issue")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @GetMapping("/{workspaceSlug}/{projectId}")
    public ResponseEntity<List<IssueResponseDto>> getAll(@PathVariable String workspaceSlug, @PathVariable UUID projectId, @AuthenticationPrincipal User user) {
        return issueService.getAll(workspaceSlug, projectId, user);
    }

    @GetMapping("/{workspaceSlug}/{projectId}/{issueId}")
    public ResponseEntity<IssueResponseDto> get(@PathVariable String workspaceSlug, @PathVariable UUID projectId, @PathVariable UUID issueId, @AuthenticationPrincipal User user) {
        return issueService.get(workspaceSlug, projectId, issueId, user);
    }

    @PostMapping("/{workspaceSlug}/{projectId}")
    public ResponseEntity<?> create(@PathVariable String workspaceSlug, @PathVariable UUID projectId, @RequestBody @Valid CreateIssueDto dto, @AuthenticationPrincipal User user) {
        return issueService.create(workspaceSlug, projectId, dto, user);
    }

    @PutMapping("/{workspaceSlug}/{projectId}/{issueId}")
    public ResponseEntity<IssueResponseDto> update(@PathVariable String workspaceSlug, @PathVariable UUID projectId, @PathVariable UUID issueId, @RequestBody @Valid UpdateIssueDto dto, @AuthenticationPrincipal User user) {
        return issueService.update(workspaceSlug, projectId, issueId, dto, user);
    }

    @DeleteMapping("/{workspaceSlug}/{projectId}/{issueId}")
    public ResponseEntity<?> delete(@PathVariable String workspaceSlug, @PathVariable UUID projectId, @PathVariable UUID issueId, @AuthenticationPrincipal User user) {
        return issueService.delete(workspaceSlug, projectId, issueId, user);
    }
}
