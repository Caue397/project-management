package dev.cauegallizzi.backend.service;

import dev.cauegallizzi.backend.dto.workspace.CreateWorkspaceDto;
import dev.cauegallizzi.backend.dto.workspace.UpdateWorkspaceDto;
import dev.cauegallizzi.backend.dto.workspace.WorkspaceResponseDto;
import dev.cauegallizzi.backend.entity.User;
import dev.cauegallizzi.backend.entity.Workspace;
import dev.cauegallizzi.backend.repository.WorkspaceRepository;
import dev.cauegallizzi.backend.util.StringUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepo;

    public WorkspaceService(WorkspaceRepository workspaceRepo) {
        this.workspaceRepo = workspaceRepo;
    }

    private WorkspaceResponseDto toDto(Workspace workspace) {
        return new WorkspaceResponseDto(workspace.getWorkspaceId(), workspace.getName(), workspace.getSlug(), workspace.getOwner().getUserId());
    }

    public ResponseEntity<List<WorkspaceResponseDto>> getAll(User user) {
        List<Workspace> workspaces = workspaceRepo.findAllByOwner(user);
        List<WorkspaceResponseDto> response = workspaces.stream()
                .map(this::toDto)
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public ResponseEntity<WorkspaceResponseDto> get(String slug, User user) {
        Workspace workspace = workspaceRepo.findBySlug(slug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.status(HttpStatus.OK).body(toDto(workspace));
    }

    public ResponseEntity<?> create(User user, CreateWorkspaceDto dto) {
        String slug = StringUtil.slugify(dto.getName());
        Workspace workspace = new Workspace(dto.getName(), slug, user);
        workspaceRepo.save(workspace);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<WorkspaceResponseDto> update(String slug, UpdateWorkspaceDto dto, User user) {
        Workspace workspace = workspaceRepo.findBySlug(slug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String newSlug = StringUtil.slugify(dto.getName());
        Workspace slugAlreadyUsed = workspaceRepo.findBySlug(newSlug).orElse(null);
        if (slugAlreadyUsed != null && !slugAlreadyUsed.getWorkspaceId().equals(workspace.getWorkspaceId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        workspace.setName(dto.getName());
        workspace.setSlug(newSlug);
        workspace.setUpdatedAt(new Date().toInstant());
        workspaceRepo.save(workspace);
        return ResponseEntity.status(HttpStatus.OK).body(toDto(workspace));
    }

    public ResponseEntity<?> delete(String slug, User user) {
        Workspace workspace = workspaceRepo.findBySlug(slug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        workspaceRepo.deleteBySlug(slug);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
