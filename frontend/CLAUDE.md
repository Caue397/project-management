# Project Management MVP - Frontend

Sistema de gerenciamento de projetos para pequenas equipes, permitindo organizar projetos e acompanhar seu status de forma simples.

## Problema

Pequenas equipes precisam de uma forma simples de organizar projetos e acompanhar seu status.

## Usuário Alvo

- Dono de uma workspace
- Cria e gerencia projetos

---

## Stack Tecnológica

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Next.js | 16.1.6 | Framework React com App Router |
| React | 19.2.3 | Biblioteca UI |
| TypeScript | 5 | Tipagem estática |
| React Query | 5.90.20 | Gerenciamento de estado do servidor |
| React Hook Form | 7.71.1 | Gerenciamento de formulários |
| Zod | 4.3.6 | Validação de schemas |
| Tailwind CSS | 4 | Estilização utility-first |
| Framer Motion | 12.29.2 | Animações |
| React Icons | 5.5.0 | Ícones |

**Package Manager:** Bun

---

## Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Primary | `#40107B` | Botões, elementos principais, ações |
| Background | `#D8D8D8` | Fundo da aplicação |
| White | `#FFFFFF` | Cards, containers, texto em fundo escuro |
| Black | `#000000` | Texto principal |

**Classes Tailwind disponíveis:**
- `bg-primary`, `text-primary`, `border-primary`
- `bg-background`, `text-background`
- `bg-white`, `text-white`
- `bg-black`, `text-black`

---

## Templates de Design

Os templates visuais e de código estão em `frontend/templates/`.

### Imagens de Referência

| Template | Caminho | Descrição |
|----------|---------|-----------|
| Sign-in/Sign-up | `templates/images/sign-in-sign-up/image.png` | Tela de autenticação |
| Workspace | `templates/images/workspace/image.png` | Dashboard com sidebar |

### Design System - Sign-in/Sign-up

- Card centralizado na tela com fundo `bg-white`
- Fundo da página: `bg-background` (#D8D8D8)
- Bordas arredondadas: `rounded-2xl`
- Título: texto grande e bold
- Subtítulo: texto menor em `text-foreground/60`
- Input: borda sutil `border-foreground/10`, fundo branco
- Botão principal: `bg-primary` com texto branco, `rounded-xl`
- Divisor "Or" entre seções
- Links de rodapé em cinza

### Design System - Workspace

- **Sidebar** (esquerda):
  - Largura fixa `max-w-[280px]`
  - Fundo: `bg-white/20`
  - Borda direita: `border-foreground/10`
  - Logo no topo
  - Categorias com label pequeno `text-xs text-foreground/50`
  - Itens de navegação com ícones (Lu icons)
  - Badges com contador: `bg-white border border-foreground/10 rounded-lg`
  - Item ativo: `bg-primary/[0.04] ring-primary/20 ring-1 text-primary`

- **Conteúdo principal**:
  - Barra de busca no topo com atalho (CTRL+K)
  - Tabela de dados com colunas e status badges
  - Status badges coloridos (Paid=verde, Pending=cinza, Voided=vermelho)

### Componentes de Template

| Componente | Arquivo | Uso |
|------------|---------|-----|
| Input | `templates/ui/input.tsx` | Campos de entrada com ícone e keybinds |
| Checkbox | `templates/ui/checkbox.tsx` | Checkbox com temas (orange, blue, black) |
| Dialog | `templates/ui/dialog.model.tsx` | Modal com Framer Motion |
| Select | `templates/ui/select.input.tsx` | Dropdown com keyboard navigation |
| Sidebar | `templates/ui/layout/sidebar.tsx` | Navegação lateral com categorias |
| Toast | `templates/ui/toast/` | Notificações |

### Padrões de Código

```typescript
// Importações padrão
import { cn } from '@/libs/utils';           // tailwind-merge helper
import { motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from '@uidotdev/usehooks';
import { Lu* } from 'react-icons/lu';        // Lucide icons

// Padrão de animação para modals/dropdowns
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 10 }}

// Estilos comuns
'border border-foreground/10'               // Bordas sutis
'bg-foreground/[0.03]'                      // Fundos muito leves
'text-foreground/50'                        // Texto secundário
'rounded-xl' ou 'rounded-2xl'               // Bordas arredondadas
'ring-1 ring-offset-2 ring-primary/40'      // Focus ring
```

### Utilitário cn() (criar em `src/libs/utils.ts`)

```typescript
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Funcionalidades do MVP

### Autenticação
- [ ] Criar conta
- [ ] Login
- [ ] Logout

### Workspace
- [ ] Criar workspace
- [ ] Visualizar workspace do usuário

### Projetos
- [ ] Criar projeto
- [ ] Listar projetos da workspace
- [ ] Alterar status do projeto
- [ ] Visualizar detalhes do projeto

**Status disponíveis:** `CREATED` → `IN_PROGRESS` → `DONE` → `ARCHIVED`

---

## Regras de Negócio

### Projetos
- Projeto começa em `CREATED`
- Só pode avançar na ordem correta de status
- Projeto `ARCHIVED` não pode ser alterado
- Nome do projeto é obrigatório

### Segurança
- Usuário só acessa sua própria workspace
- Usuário só acessa projetos da sua workspace

---

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Rotas de autenticação
│   │   │   ├── sign-in/          # Página de login
│   │   │   └── sign-up/          # Página de cadastro
│   │   ├── [workspace]/          # Rotas dinâmicas de workspace
│   │   │   ├── layout.tsx        # Layout da workspace
│   │   │   ├── page.tsx          # Dashboard da workspace
│   │   │   └── [project]/        # Rotas de projeto
│   │   │       └── page.tsx      # Detalhes do projeto
│   │   ├── layout.tsx            # Layout raiz
│   │   ├── page.tsx              # Home/Landing
│   │   └── globals.css           # Estilos globais
│   ├── components/
│   │   ├── layout/               # Componentes de layout
│   │   └── ui/                   # Componentes UI reutilizáveis
│   ├── fonts/                    # Configuração de fontes
│   ├── libs/                     # Utilitários e helpers
│   └── network/                  # Cliente API e chamadas de rede
├── documents/                    # Documentação do projeto
└── public/                       # Assets estáticos
```

---

## Componentes Planejados

| Componente | Descrição |
|------------|-----------|
| Sidebar | Navegação entre workspaces |
| Dialog | Modais para criação/edição |
| Button | Botões reutilizáveis |
| Input | Campos de entrada |

---

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Home/Landing page |
| `/sign-in` | Login |
| `/sign-up` | Cadastro |
| `/[workspace]` | Dashboard da workspace |
| `/[workspace]/[project]` | Detalhes do projeto |

---

## Backend (Referência)

O frontend se comunica com um backend Spring Boot que expõe:

**Endpoints:**
- Auth (autenticação)
- Workspace (gerenciamento de workspaces)
- Projects (gerenciamento de projetos)

**Database:** PostgreSQL

**Modelos:**
- User
- Workspace
- Projects

---

## Scripts

```bash
# Desenvolvimento
bun dev

# Build de produção
bun run build

# Iniciar produção
bun start

# Linting
bun lint
```

---

## Status do Desenvolvimento

O projeto está em **fase inicial de configuração**. A estrutura base está configurada com:

- Roteamento definido
- Configuração de estilos (Tailwind + tema claro/escuro)
- TypeScript strict mode
- Dependências instaladas

**Próximos passos:**
1. Implementar componentes UI base (Button, Input, Dialog)
2. Configurar cliente de API (network layer)
3. Implementar páginas de autenticação
4. Implementar dashboard da workspace
5. Implementar gerenciamento de projetos
