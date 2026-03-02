package dev.cauegallizzi.backend.service;

import dev.cauegallizzi.backend.dto.issue.CreateIssueDto;
import dev.cauegallizzi.backend.dto.issue.IssueResponseDto;
import dev.cauegallizzi.backend.dto.issue.UpdateIssueDto;
import dev.cauegallizzi.backend.entity.Issue;
import dev.cauegallizzi.backend.entity.Project;
import dev.cauegallizzi.backend.entity.User;
import dev.cauegallizzi.backend.entity.Workspace;
import dev.cauegallizzi.backend.entity.enums.IssueStatus;
import dev.cauegallizzi.backend.repository.IssueRepository;
import dev.cauegallizzi.backend.repository.ProjectRepository;
import dev.cauegallizzi.backend.repository.WorkspaceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class IssueService {

    private final WorkspaceRepository workspaceRepo;
    private final ProjectRepository projectRepo;
    private final IssueRepository issueRepo;

    public IssueService(WorkspaceRepository workspaceRepo, ProjectRepository projectRepo, IssueRepository issueRepo) {
        this.workspaceRepo = workspaceRepo;
        this.projectRepo = projectRepo;
        this.issueRepo = issueRepo;
    }

    private IssueResponseDto toDto(Issue issue) {
        return new IssueResponseDto(
                issue.getIssueId(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getStatus(),
                issue.getCreatedAt(),
                issue.getUpdatedAt()
        );
    }

    public ResponseEntity<List<IssueResponseDto>> getAll(String workspaceSlug, UUID projectId, User user) {
        Workspace workspace = workspaceRepo.findBySlug(workspaceSlug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Project project = projectRepo.findById(projectId).orElse(null);
        if (project == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!project.getWorkspace().getWorkspaceId().equals(workspace.getWorkspaceId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        List<IssueResponseDto> response = issueRepo.findAllByProject(project).stream()
                .map(this::toDto)
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public ResponseEntity<IssueResponseDto> get(String workspaceSlug, UUID projectId, UUID issueId, User user) {
        Workspace workspace = workspaceRepo.findBySlug(workspaceSlug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Project project = projectRepo.findById(projectId).orElse(null);
        if (project == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!project.getWorkspace().getWorkspaceId().equals(workspace.getWorkspaceId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Issue issue = issueRepo.findById(issueId).orElse(null);
        if (issue == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!issue.getProject().getProjectId().equals(project.getProjectId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.status(HttpStatus.OK).body(toDto(issue));
    }

    public ResponseEntity<?> create(String workspaceSlug, UUID projectId, CreateIssueDto dto, User user) {
        Workspace workspace = workspaceRepo.findBySlug(workspaceSlug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Project project = projectRepo.findById(projectId).orElse(null);
        if (project == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!project.getWorkspace().getWorkspaceId().equals(workspace.getWorkspaceId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Issue issue = new Issue();
        issue.setTitle(dto.getTitle());
        issue.setDescription(dto.getDescription());
        issue.setStatus(IssueStatus.OPEN);
        issue.setProject(project);
        issueRepo.save(issue);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<IssueResponseDto> update(String workspaceSlug, UUID projectId, UUID issueId, UpdateIssueDto dto, User user) {
        Workspace workspace = workspaceRepo.findBySlug(workspaceSlug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Project project = projectRepo.findById(projectId).orElse(null);
        if (project == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!project.getWorkspace().getWorkspaceId().equals(workspace.getWorkspaceId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Issue issue = issueRepo.findById(issueId).orElse(null);
        if (issue == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!issue.getProject().getProjectId().equals(project.getProjectId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        issue.setTitle(dto.getTitle());
        issue.setDescription(dto.getDescription());
        issue.setUpdatedAt(new Date().toInstant());
        if (dto.getStatus() != null) issue.setStatus(dto.getStatus());
        issueRepo.save(issue);
        return ResponseEntity.status(HttpStatus.OK).body(toDto(issue));
    }

    public ResponseEntity<?> delete(String workspaceSlug, UUID projectId, UUID issueId, User user) {
        Workspace workspace = workspaceRepo.findBySlug(workspaceSlug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Project project = projectRepo.findById(projectId).orElse(null);
        if (project == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!project.getWorkspace().getWorkspaceId().equals(workspace.getWorkspaceId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Issue issue = issueRepo.findById(issueId).orElse(null);
        if (issue == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!issue.getProject().getProjectId().equals(project.getProjectId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        issueRepo.deleteById(issueId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
