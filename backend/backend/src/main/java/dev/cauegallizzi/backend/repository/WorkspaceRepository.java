package dev.cauegallizzi.backend.repository;

import dev.cauegallizzi.backend.entity.User;
import dev.cauegallizzi.backend.entity.Workspace;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {
    Optional<Workspace> findBySlug(String slug);
    List<Workspace> findAllByOwner(User owner);

    @Transactional
    void deleteBySlug(String slug);
}
