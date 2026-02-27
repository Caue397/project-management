package dev.cauegallizzi.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "tb_workspaces")
public class Workspace {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "workspace_id")
    private UUID workspaceId;
    private String name;
    @Column(unique = true)
    private String slug;
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Project> projects = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_user_id", nullable = false)
    private User owner;

    public Workspace(String name, String slug, User owner) {
        this.name = name;
        this.slug = slug;
        this.owner = owner;
    }

    @CreationTimestamp
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;

}
