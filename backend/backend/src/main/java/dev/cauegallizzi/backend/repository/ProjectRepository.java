package dev.cauegallizzi.backend.repository;

import dev.cauegallizzi.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {}
