# Backend API Documentation

> **Base URL:** `http://localhost:8080`
> **Auth:** JWT via HTTP-Only cookie (`pm.auth`) — 24h expiration
> **Content-Type:** `application/json`

---

## Authentication

The backend uses **stateless JWT authentication** stored in an HTTP-Only cookie.

- Cookie name: `pm.auth`
- Cookie is set automatically on sign-in and cleared on sign-out
- All protected routes read the cookie automatically (no `Authorization` header needed)
- **JavaScript cannot access the cookie** (HttpOnly flag)

### How to handle auth in fetch calls

```ts
fetch('/auth/sign-in', {
  method: 'POST',
  credentials: 'include', // REQUIRED — sends/receives cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

> Always include `credentials: 'include'` in every request (both auth and protected routes).

---

## Routes

### Auth Routes — Public (no cookie required)

#### `POST /auth/sign-up`

Register a new user account.

**Request body:**
```json
{
  "name": "string",     // min 2, max 50 chars
  "email": "string",    // valid email format
  "password": "string"  // must have uppercase, lowercase, number, and special char (@#$%^&+=)
}
```

**Responses:**
| Status | Meaning |
|--------|---------|
| `201` | User created successfully |
| `409` | Email already in use |
| `400` | Validation error (invalid fields) |

---

#### `POST /auth/sign-in`

Authenticate and receive the auth cookie.

**Request body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**
| Status | Meaning |
|--------|---------|
| `200` | Login successful — `pm.auth` cookie is set |
| `401` | Invalid credentials |

---

#### `POST /auth/sign-out`

Clear the auth cookie and invalidate the session.

**Request body:** none

**Responses:**
| Status | Meaning |
|--------|---------|
| `200` | Signed out — `pm.auth` cookie is deleted |

---

#### `GET /auth/session`

Validate the current session and return the authenticated user's data.

**Request:** No body — reads the `pm.auth` cookie automatically.

**Response body (`200`):**
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string"
}
```

**Responses:**
| Status | Meaning |
|--------|---------|
| `200` | Session valid — returns user data |
| `401` | Not authenticated or token expired |

> Used by the Next.js middleware to protect routes server-side before the page renders.

---

### Workspace Routes — Protected (requires `pm.auth` cookie)

All workspace operations are **owner-only**. A user can only access workspaces they created.

#### `GET /workspace`

List all workspaces owned by the authenticated user.

**Request:** No body — reads the `pm.auth` cookie automatically.

**Response body (`200`):**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "slug": "string",
    "ownerId": "uuid"
  }
]
```

**Responses:**
| Status | Meaning |
|--------|---------|
| `200` | Returns array of workspaces (empty array if none) |
| `401` | Not authenticated |

---

#### `GET /workspace/{slug}`

Fetch a workspace by its slug.

**Path params:**
- `slug` — URL-friendly identifier of the workspace (e.g. `my-project`)

**Response body (`200`):**
```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "ownerId": "uuid"
}
```

**Responses:**
| Status | Meaning |
|--------|---------|
| `200` | Workspace found |
| `401` | Not authenticated or not the owner |
| `404` | Workspace not found |

---

#### `POST /workspace`

Create a new workspace. The slug is auto-generated from the name.

**Request body:**
```json
{
  "name": "string" // min 2, max 50 chars
}
```

**Slug generation:** spaces → hyphens, accents removed, lowercase, special chars removed.
Example: `"Meu Projeto"` → slug `"meu-projeto"`

**Response body:** None — `201` with empty body.

> After creating, compute the slug on the frontend using the same logic as the backend to redirect the user. See slug generation rules above.

**Responses:**
| Status | Meaning |
|--------|---------|
| `201` | Workspace created (no body) |
| `400` | Validation error |
| `401` | Not authenticated |

---

#### `PUT /workspace/{slug}`

Update an existing workspace's name (and regenerates the slug).

**Path params:**
- `slug` — current slug of the workspace

**Request body:**
```json
{
  "name": "string" // min 2, max 50 chars
}
```

**Response body (`200`):** Same as `GET /workspace/{slug}`

**Responses:**
| Status | Meaning |
|--------|---------|
| `200` | Updated — returns new workspace data |
| `400` | Validation error |
| `401` | Not authenticated or not the owner |
| `404` | Workspace not found |

> **Note:** After updating, the slug changes. Navigate the user to the new slug URL.

---

#### `DELETE /workspace/{slug}`

Delete a workspace and all its projects (cascade delete).

**Path params:**
- `slug` — slug of the workspace to delete

**Responses:**
| Status | Meaning |
|--------|---------|
| `200` | Deleted successfully |
| `401` | Not authenticated or not the owner |
| `404` | Workspace not found |

---

### Project Routes — Protected (requires `pm.auth` cookie)

All project operations are **owner-only**. A user can only access projects within workspaces they own.

#### `GET /project/{workspaceSlug}`

List all projects in a workspace.

**Path params:**
- `workspaceSlug` — slug of the workspace

**Response body (`200`):**
```json
[
  {
    "id": "uuid",
    "title": "string",
    "description": "string | null",
    "content": "string | null",
    "status": "CREATED | IN_PROGRESS | DONE | ARCHIVED",
    "createdAt": "ISO-8601",
    "updatedAt": "ISO-8601"
  }
]
```

**Responses:**
| Status | Meaning |
|--------|---------|
| `200` | Returns array of projects (empty array if none) |
| `401` | Not authenticated or not the workspace owner |
| `404` | Workspace not found |

---

#### `GET /project/{workspaceSlug}/{projectId}`

Fetch a single project by ID.

**Path params:**
- `workspaceSlug` — slug of the workspace
- `projectId` — UUID of the project

**Response body (`200`):**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "content": "string | null",
  "status": "CREATED | IN_PROGRESS | DONE | ARCHIVED",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

**Responses:**
| Status | Meaning |
|--------|---------|
| `200` | Project found |
| `401` | Not authenticated, not the workspace owner, or project doesn't belong to this workspace |
| `404` | Workspace or project not found |

---

#### `POST /project/{workspaceSlug}`

Create a new project in the workspace. Status is always set to `CREATED` automatically.

**Path params:**
- `workspaceSlug` — slug of the workspace

**Request body:**
```json
{
  "title": "string",       // required — min 2, max 100 chars
  "description": "string"  // optional
}
```

**Response body:** None — `201` with empty body.

**Responses:**
| Status | Meaning |
|--------|---------|
| `201` | Project created (no body) |
| `400` | Validation error |
| `401` | Not authenticated or not the workspace owner |
| `404` | Workspace not found |

---

#### `PUT /project/{workspaceSlug}/{projectId}`

Update a project's title, description, and/or status.

**Path params:**
- `workspaceSlug` — slug of the workspace
- `projectId` — UUID of the project

**Request body:**
```json
{
  "title": "string",                              // required — min 2, max 100 chars
  "description": "string",                        // optional
  "status": "CREATED | IN_PROGRESS | DONE | ARCHIVED" // optional — omit to keep current status
}
```

**Response body (`200`):** Same as `GET /project/{workspaceSlug}/{projectId}`

**Responses:**
| Status | Meaning |
|--------|---------|
| `200` | Updated — returns updated project data |
| `400` | Validation error |
| `401` | Not authenticated, not the workspace owner, or project doesn't belong to this workspace |
| `404` | Workspace or project not found |

> **Note:** The backend does **not** enforce status transition order. Status transition rules (`CREATED → IN_PROGRESS → DONE → ARCHIVED`) must be validated on the frontend.

---

#### `DELETE /project/{workspaceSlug}/{projectId}`

Delete a project.

**Path params:**
- `workspaceSlug` — slug of the workspace
- `projectId` — UUID of the project

**Responses:**
| Status | Meaning |
|--------|---------|
| `200` | Deleted successfully |
| `401` | Not authenticated, not the workspace owner, or project doesn't belong to this workspace |
| `404` | Workspace or project not found |

---

## Data Models

### User

| Field | Type | Notes |
|-------|------|-------|
| `userId` | UUID | Primary key |
| `name` | String | Full name |
| `email` | String | Unique |
| `password` | String | BCrypt hashed |
| `createdAt` | Instant | Auto-set |
| `updatedAt` | Instant | Auto-set |

---

### Workspace

| Field | Type | Notes |
|-------|------|-------|
| `workspaceId` | UUID | Primary key |
| `name` | String | Display name |
| `slug` | String | URL identifier (auto-generated) |
| `owner` | User | Foreign key to User |
| `createdAt` | Instant | Auto-set |
| `updatedAt` | Instant | Auto-set |

---

### Project

| Field | Type | Notes |
|-------|------|-------|
| `projectId` | UUID | Primary key |
| `title` | String | Project title |
| `description` | String | Short description |
| `content` | String | Detailed content |
| `status` | Enum | `CREATED`, `IN_PROGRESS`, `DONE`, `ARCHIVED` |
| `workspace` | Workspace | Parent workspace |
| `createdAt` | Instant | Auto-set |
| `updatedAt` | Instant | Auto-set |

---

## Entity Relationships

```
User (1) ──── (many) Workspace
                          │
                     (many) Project
```

- A user owns multiple workspaces
- A workspace contains multiple projects
- Deleting a workspace cascades to its projects
- Deleting a user cascades to their workspaces

---

## Password Validation Rules

Passwords must contain:
- At least one **uppercase** letter
- At least one **lowercase** letter
- At least one **number**
- At least one **special character**: `@`, `#`, `$`, `%`, `^`, `&`, `+`, `=`

---

## Database

- **PostgreSQL** on `localhost:5432`
- Database name: `project_management`
- Tables: `tb_users`, `tb_workspaces`, `tb_projects`
- All IDs are UUIDs

---

## Security Notes

- CSRF is **disabled** (API design — safe to call from frontend without CSRF tokens)
- CORS is not explicitly configured (permissive by default in development)
- Sessions are **stateless** — no server-side session storage
- JWT secret and expiration are configured via `application.properties`

---

## Error Handling Pattern

The backend responds with standard HTTP status codes. There is no unified error body format currently — handle by status code on the frontend.

```ts
const res = await fetch('/workspace/my-slug', { credentials: 'include' })

if (res.status === 401) // not authenticated or not owner
if (res.status === 404) // not found
if (res.status === 409) // conflict (e.g., email already used)
if (res.ok)             // success
```
