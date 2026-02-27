package dev.cauegallizzi.backend.repository;

import dev.cauegallizzi.backend.entity.Project;
import dev.cauegallizzi.backend.entity.Workspace;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findAllByWorkspace(Workspace workspace);

    @Transactional
    void deleteById(UUID projectId);
}
