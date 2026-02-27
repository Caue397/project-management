package dev.cauegallizzi.backend.service;

import dev.cauegallizzi.backend.dto.workspace.CreateWorkspaceDto;
import dev.cauegallizzi.backend.dto.workspace.UpdateWorkspaceDto;
import dev.cauegallizzi.backend.dto.workspace.WorkspaceResponseDto;
import dev.cauegallizzi.backend.entity.User;
import dev.cauegallizzi.backend.entity.Workspace;
import dev.cauegallizzi.backend.repository.WorkspaceRepository;
import dev.cauegallizzi.backend.util.StringUtil;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepo;

    public WorkspaceService(WorkspaceRepository workspaceRepo) {
        this.workspaceRepo = workspaceRepo;
    }

    public ResponseEntity<List<WorkspaceResponseDto>> getAll(User user) {
        List<Workspace> workspaces = workspaceRepo.findAllByOwner(user);
        List<WorkspaceResponseDto> response = workspaces.stream()
                .map(w -> new WorkspaceResponseDto(w.getWorkspaceId(), w.getName(), w.getSlug(), w.getOwner().getUserId()))
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public ResponseEntity<WorkspaceResponseDto> get(String slug, User user) {
        Workspace workspace = workspaceRepo.findBySlug(slug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        WorkspaceResponseDto responseDto = new WorkspaceResponseDto(workspace.getWorkspaceId(), workspace.getName(), workspace.getSlug(), workspace.getOwner().getUserId());
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    public ResponseEntity<?> create(User user, CreateWorkspaceDto dto) {
        String slug = StringUtil.slugify(dto.getName());
        Workspace workspace = new Workspace(dto.getName(), slug, user);
        workspaceRepo.save(workspace);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<WorkspaceResponseDto> update(String slug, UpdateWorkspaceDto dto, User user) {
        Workspace workspace = workspaceRepo.findBySlug(slug).orElse(null);
        Workspace slugAlreadyUsed = workspaceRepo.findBySlug(slug).orElse(null);
        if (slugAlreadyUsed != null) return ResponseEntity.status(HttpStatus.CONFLICT).build();
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        workspace.setName(dto.getName());
        workspace.setSlug(StringUtil.slugify(dto.getName()));
        workspace.setUpdatedAt(new Date().toInstant());
        workspaceRepo.save(workspace);
        WorkspaceResponseDto response = new WorkspaceResponseDto(workspace.getWorkspaceId(), workspace.getName(), workspace.getSlug(), workspace.getOwner().getUserId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public ResponseEntity<?> delete(String slug, User user) {
        Workspace workspace = workspaceRepo.findBySlug(slug).orElse(null);
        if (workspace == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        if (!workspace.getOwner().getUserId().equals(user.getUserId())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        workspaceRepo.deleteBySlug(slug);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
