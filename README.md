# Project Management MVP

Sistema de gerenciamento de projetos para pequenas equipes, com foco em simplicidade e rastreamento de status.

---

## Problema

Pequenas equipes frequentemente carecem de uma ferramenta simples e objetiva para organizar seus projetos e acompanhar o andamento de cada um. Ferramentas existentes costumam ser complexas demais para times enxutos que precisam apenas de visibilidade clara sobre o status dos projetos.

Este MVP resolve esse problema oferecendo um ambiente de **workspace** onde o usuário cria e gerencia seus projetos, acompanhando a evolução de cada um por meio de um fluxo de status bem definido.

---

## Funcionalidades

### Autenticação
- Criar conta
- Login / Logout

### Workspace
- Criar workspace
- Visualizar workspaces do usuário

### Projetos
- Criar projeto dentro de uma workspace
- Listar projetos da workspace
- Visualizar detalhes de um projeto
- Alterar status do projeto seguindo o fluxo: `CREATED` → `IN_PROGRESS` → `DONE` → `ARCHIVED`

### Regras de Negócio
- Projeto começa obrigatoriamente em `CREATED`
- O status só pode avançar na ordem correta — não é permitido pular etapas
- Um projeto com status `ARCHIVED` não pode mais ser alterado
- O nome do projeto é obrigatório
- Usuário só acessa sua própria workspace e seus próprios projetos

---

## Stack Tecnológica

### Frontend

| Tecnologia | Versão | Propósito |
|---|---|---|
| Next.js | 16.1.6 | Framework React com App Router e SSR |
| React | 19.2.3 | Biblioteca de interface |
| TypeScript | 5 | Tipagem estática |
| TanStack React Query | 5.90.20 | Gerenciamento de estado servidor e cache |
| React Hook Form | 7.71.1 | Gerenciamento de formulários |
| Zod | 4.3.6 | Validação de schemas |
| Tailwind CSS | 4 | Estilização utility-first |
| Framer Motion | 12.29.2 | Animações |
| Axios | 1.13.5 | Cliente HTTP |
| React Icons | 5.5.0 | Ícones |

**Package Manager:** [Bun](https://bun.sh)

### Backend

| Tecnologia | Versão | Propósito |
|---|---|---|
| Java | 21 | Linguagem |
| Spring Boot | 4.0.2 | Framework principal |
| Spring Security | — | Autenticação e autorização |
| Spring Data JPA | — | Persistência e ORM |
| JJWT | 0.12.6 | Geração e validação de tokens JWT |
| Lombok | — | Redução de boilerplate |
| PostgreSQL | — | Banco de dados relacional |

---

## Arquitetura

A aplicação segue uma arquitetura **cliente-servidor** desacoplada:

- O **frontend** (Next.js) se comunica com o backend via HTTP, usando cookies `HttpOnly` para transportar o JWT de autenticação.
- O **backend** (Spring Boot) expõe uma API REST, protegida pelo Spring Security com um filtro JWT customizado.
- O banco de dados **PostgreSQL** é gerenciado pelo Hibernate via Spring Data JPA com DDL automático.

```
┌──────────────────────┐        HTTP + Cookie JWT       ┌────────────────────────┐
│   Frontend (Next.js) │ ──────────────────────────────▶ │  Backend (Spring Boot) │
│   localhost:3000     │ ◀────────────────────────────── │  localhost:8080        │
└──────────────────────┘                                 └──────────┬─────────────┘
                                                                    │ JPA/Hibernate
                                                         ┌──────────▼─────────────┐
                                                         │   PostgreSQL            │
                                                         │   project_management    │
                                                         └─────────────────────────┘
```

---

## Estrutura do Projeto

```
project-management-mvp/
├── frontend/                          # Aplicação Next.js
│   └── src/
│       ├── app/                       # Next.js App Router
│       │   ├── (auth)/
│       │   │   ├── sign-in/           # Página de login
│       │   │   └── sign-up/           # Página de cadastro
│       │   ├── workspace/
│       │   │   └── [workspace]/
│       │   │       ├── layout.tsx     # Layout com sidebar
│       │   │       ├── page.tsx       # Dashboard da workspace
│       │   │       ├── settings/      # Configurações da workspace
│       │   │       └── [project]/     # Detalhes do projeto
│       │   ├── layout.tsx             # Layout raiz com providers
│       │   └── page.tsx               # Página inicial
│       ├── components/
│       │   ├── layout/                # Sidebar, estrutura de layout
│       │   ├── pages/                 # Componentes de página
│       │   └── ui/                    # Componentes reutilizáveis (Button, Input, Dialog, Table)
│       ├── network/
│       │   ├── network.ts             # Instância Axios configurada
│       │   ├── queries/               # Queries para Client Components (React Query)
│       │   └── ssr/                   # Prefetch para Server Components
│       ├── schemas/                   # Schemas de validação Zod
│       ├── libs/                      # Utilitários (merge-classname, promise-status, string)
│       └── providers/                 # Providers globais (React Query)
│
└── backend/                           # Aplicação Spring Boot
    └── src/main/java/dev/cauegallizzi/backend/
        ├── config/                    # SecurityConfig, CORS
        ├── controller/                # AuthController, WorkspaceController, ProjectController
        ├── service/                   # AuthService, WorkspaceService, ProjectService, JwtService
        ├── repository/                # UserRepository, WorkspaceRepository, ProjectRepository
        ├── entity/                    # User, Workspace, Project + enums
        ├── dto/                       # DTOs de request e response
        ├── filter/                    # JwtAuthenticationFilter
        └── util/                      # CookieUtil, StringUtil
```

---

## API REST

### Autenticação — `/auth`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/auth/session` | Retorna os dados do usuário autenticado |
| `POST` | `/auth/sign-up` | Cadastro de novo usuário |
| `POST` | `/auth/sign-in` | Login — define cookie JWT HttpOnly |
| `POST` | `/auth/sign-out` | Logout — remove o cookie JWT |

### Workspace — `/workspace`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/workspace` | Lista todas as workspaces do usuário |
| `GET` | `/workspace/{slug}` | Retorna uma workspace pelo slug |
| `POST` | `/workspace` | Cria uma nova workspace |
| `PUT` | `/workspace/{slug}` | Atualiza uma workspace |
| `DELETE` | `/workspace/{slug}` | Remove uma workspace |

### Projetos — `/project`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/project/{workspaceSlug}` | Lista todos os projetos da workspace |
| `GET` | `/project/{workspaceSlug}/{projectId}` | Retorna um projeto específico |
| `POST` | `/project/{workspaceSlug}` | Cria um novo projeto |
| `PUT` | `/project/{workspaceSlug}/{projectId}` | Atualiza um projeto (inclui mudança de status) |
| `DELETE` | `/project/{workspaceSlug}/{projectId}` | Remove um projeto |

---

## Como Rodar

### Pré-requisitos

- [Bun](https://bun.sh) — gerenciador de pacotes do frontend
- Java 21
- Maven
- PostgreSQL rodando localmente

### 1. Banco de Dados

Crie o banco de dados no PostgreSQL:

```sql
CREATE DATABASE project_management;
```

### 2. Backend

Configure as variáveis em `backend/backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/project_management
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

jwt.secret=sua_chave_secreta_aqui
```

Suba o servidor:

```bash
cd backend/backend
./mvnw spring-boot:run
```

O backend estará disponível em `http://localhost:8080`.

### 3. Frontend

Instale as dependências e inicie o servidor de desenvolvimento:

```bash
cd frontend
bun install
bun dev
```

O frontend estará disponível em `http://localhost:3000`.

---

## Segurança

- A autenticação é feita via **JWT armazenado em cookie `HttpOnly`**, impedindo acesso via JavaScript no cliente.
- Todas as rotas da API (exceto `/auth/sign-up` e `/auth/sign-in`) exigem token válido.
- O backend valida que o usuário autenticado é o dono da workspace em todas as operações, impedindo acesso a recursos de outros usuários.
