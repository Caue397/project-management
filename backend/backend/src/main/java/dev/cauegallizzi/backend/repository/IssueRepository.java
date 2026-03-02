package dev.cauegallizzi.backend.repository;

import dev.cauegallizzi.backend.entity.Issue;
import dev.cauegallizzi.backend.entity.Project;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface IssueRepository extends JpaRepository<Issue, UUID> {
    List<Issue> findAllByProject(Project project);

    @Transactional
    void deleteById(UUID issueId);
}
