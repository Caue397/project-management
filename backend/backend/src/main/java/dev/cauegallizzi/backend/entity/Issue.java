package dev.cauegallizzi.backend.entity;

import dev.cauegallizzi.backend.entity.enums.IssueStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "tb_issues")
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "issue_id")
    private UUID issueId;
    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private IssueStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @CreationTimestamp
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;

}
