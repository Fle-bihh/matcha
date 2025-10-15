# Matcha 💕

🚧 **Project in active development for 42 Porto** 🚧

Modern dating website developed for 42 Porto school, combining an elegant React interface with a robust API to connect students and create authentic relationships.

## 🚀 Technology Stack

-   **Frontend**: React 18 + TypeScript + Vite + Redux Toolkit
-   **Backend**: Node.js + Express + TypeScript
-   **Database**: MySQL 8.0
-   **Infrastructure**: Docker + Docker Compose
-   **Architecture**: Monorepo with npm workspaces

## ⚡ Quick Start

### Local Installation (recommended for VS Code)

```bash
make install  # Install dependencies and avoid TypeScript errors
```

### Development with Docker

```bash
make re       # Launch complete environment
```

### Available Services

-   **Backend API**: http://localhost:3000/api/v1
-   **Web Application**: http://localhost:3001
-   **Database**: http://localhost:8080 (Adminer)

## 🏗️ Architecture

### Monorepo Structure

```
matcha/
├── apps/
│   ├── server/         # Backend API (Node.js/Express)
│   └── web/           # React Frontend
├── packages/
│   └── shared/        # Shared code (types, models, validation)
└── docs/             # Technical documentation
```

### Monorepo Advantages

-   **Code sharing** via `@matcha/shared`
-   **Synchronization** between frontend and backend
-   **Simplified development** in a single repository
-   **Optimized builds** with shared dependencies

## 🛠️ Available Commands

### Development

```bash
make re         # Restart environment
make with-logs  # Launch with visible logs
make show-logs  # Display logs
make down       # Stop containers
```

### Maintenance

```bash
make clean      # Clean local builds
make no-cache   # Complete reset (removes volumes)
```

## � Documentation

-   **[Root.doc.md](./Root.doc.md)** - Root configuration and infrastructure
-   **apps/server/** - Backend API documentation _(coming soon)_
-   **apps/web/** - React frontend documentation _(coming soon)_
-   **packages/shared/** - Shared package documentation _(coming soon)_

## 🔧 Technical Features

### Backend (`apps/server`)

-   Architecture based on dependency inversion
-   Custom decorators system (@Route, @Auth)
-   Dependency injection with container
-   Integrated Zod validation

### Frontend (`apps/web`)

-   Modular architecture with Redux Toolkit
-   React Router routing system
-   Client-side dependency injection
-   Reusable components

### Shared Package (`packages/shared`)

-   Common TypeScript types
-   Data models (User, etc.)
-   Zod validation schemas
-   Unified logger

---

_Developed with ❤️ for the 42 Porto community_
