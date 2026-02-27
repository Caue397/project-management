package dev.cauegallizzi.backend.service;

import dev.cauegallizzi.backend.dto.project.CreateProjectDto;
import dev.cauegallizzi.backend.dto.project.ProjectResponseDto;
import dev.cauegallizzi.backend.dto.project.UpdateProjectDto;
import dev.cauegallizzi.backend.entity.Project;
import dev.cauegallizzi.backend.entity.User;
import dev.cauegallizzi.backend.entity.Workspace;
import dev.cauegallizzi.backend.entity.enums.ProjectStatus;
import dev.cauegallizzi.backend.repository.ProjectRepository;
import dev.cauegallizzi.backend.repository.WorkspaceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    private final WorkspaceRepository workspaceRepo;
    private final ProjectRepository projectRepo;

    public ProjectService(WorkspaceRepository workspaceRepo, ProjectRepository projectRepo) {
        this.workspaceRepo = workspaceRepo;
        this.projectRepo = projectRepo;
    }

    private ProjectResponseDto toDto(Project project) {
        return new ProjectResponseDto(
                project.getProjectId(),
                project.getTitle(),
                project.getDescription(),
                project.getContent(),
                project.getStatus(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }

    public ResponseEntity<List<ProjectResponseDto>> getAll(String workspaceSlug, User user) {
        Workspace workspace = workspaceRepo.findBySlug(workspaceSlug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        List<ProjectResponseDto> response = projectRepo.findAllByWorkspace(workspace).stream()
                .map(this::toDto)
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public ResponseEntity<ProjectResponseDto> get(String workspaceSlug, UUID projectId, User user) {
        Workspace workspace = workspaceRepo.findBySlug(workspaceSlug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Project project = projectRepo.findById(projectId).orElse(null);
        if (project == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!project.getWorkspace().getWorkspaceId().equals(workspace.getWorkspaceId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.status(HttpStatus.OK).body(toDto(project));
    }

    public ResponseEntity<?> create(String workspaceSlug, CreateProjectDto dto, User user) {
        Workspace workspace = workspaceRepo.findBySlug(workspaceSlug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Project project = new Project();
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setStatus(ProjectStatus.CREATED);
        project.setWorkspace(workspace);
        projectRepo.save(project);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<ProjectResponseDto> update(String workspaceSlug, UUID projectId, UpdateProjectDto dto, User user) {
        Workspace workspace = workspaceRepo.findBySlug(workspaceSlug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Project project = projectRepo.findById(projectId).orElse(null);
        if (project == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!project.getWorkspace().getWorkspaceId().equals(workspace.getWorkspaceId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setUpdatedAt(new Date().toInstant());
        if (dto.getStatus() != null) project.setStatus(dto.getStatus());
        projectRepo.save(project);
        return ResponseEntity.status(HttpStatus.OK).body(toDto(project));
    }

    public ResponseEntity<?> delete(String workspaceSlug, UUID projectId, User user) {
        Workspace workspace = workspaceRepo.findBySlug(workspaceSlug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Project project = projectRepo.findById(projectId).orElse(null);
        if (project == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!project.getWorkspace().getWorkspaceId().equals(workspace.getWorkspaceId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        projectRepo.deleteById(projectId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
