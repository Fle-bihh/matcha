# Matcha 💕

A modern dating website developed for 42 Porto school, combining an elegant React interface with a robust API to connect students and create authentic relationships.

## 🚀 Global Technology Stack

-   **Frontend**: React 18 + TypeScript + Vite + Redux Toolkit
-   **Backend**: Node.js + Express + TypeScript
-   **Database**: MySQL 8.0
-   **Infrastructure**: Docker + Docker Compose
-   **Architecture**: Monorepo with npm workspaces
-   **Development Tools**: TSX, Adminer, Redux DevTools

## 📋 Available Make Commands

### Local Commands (VS Code)

These commands help avoid TypeScript errors in VS Code by installing dependencies locally:

```bash
make clean    # Cleans all node_modules, dist, and build files
make install  # Installs dependencies and builds the shared package
```

### Docker Commands

These commands use Docker for development:

```bash
make dev      # Launches the complete environment with Docker Compose
make down     # Stops all containers
make re       # Restarts the environment (down + up --build)
make no-cache # Complete reset: removes volumes and Docker cache
```

## 🌐 Available Services (Docker)

When Docker is running, you have access to:

### 🔗 Backend API - Port 3000

-   **Base URL**: `http://localhost:3000/api/v1`

### 🗄️ Database Administration - Port 8080

-   **Adminer**: Web interface to manage MySQL
-   **URL**: `http://localhost:8080`

### 🎨 Web Interface - Port 3001

-   **React Application**: `http://localhost:3001`
-   **Redux DevTools**: Available in browser for debugging (Redux DevTools extension on browser)

## 🏗️ Monorepo Architecture

```
matcha/
├── apps/                    # Main applications
│   ├── server/             # Backend API
│   └── web/               # React Frontend
├── packages/              # Shared packages
│   └── shared/           # Common code (types, models, validation)
└── docker-compose.yml    # Infrastructure configuration
```

### Monorepo Advantages:

-   **Code Sharing**: Common types and models via `@matcha/shared`
-   **Synchronization**: Ensures consistency between frontend and backend
-   **Simplified Development**: Single repository to manage
-   **Optimized Build**: Shared dependencies

## 📦 Shared Package (`packages/shared`)

The core of code sharing between applications:

### Structure

```
packages/shared/src/
├── models/              # Data models (User, Hello)
├── types/              # Common TypeScript types
├── validation/         # Zod validation schemas
└── logger/            # Unified logging system
```

### Usage

```typescript
// In server and web
import { UserModel, HelloModel } from "@matcha/shared";
import { ApiResponse, UserCreateRequest } from "@matcha/shared/types";
```

## 🖥️ Server Structure (`apps/server`)

Architecture based on dependency inversion with containers and decorators:

```
apps/server/src/
├── controllers/        # REST controllers with decorators
├── services/          # Business logic
├── repositories/      # Data access
├── decorators/        # Custom decorators (@Route, @Auth, etc.)
├── middleware/        # Express middlewares
├── dto/              # Data Transfer Objects
├── types/            # Server-specific types
└── utils/            # Utilities
```

## 🎨 Web Structure (`apps/web`)

Modern React application with Redux and modular architecture:

```
apps/web/src/
├── app/               # Main configuration (App.tsx)
├── components/        # Reusable React components
├── hooks/            # Custom hooks
├── services/         # API services and business logic
├── store/            # Redux configuration (slices, thunks, selectors)
├── types/            # Frontend-specific types
├── utils/            # Frontend utilities
└── constants/        # Constants and configuration
```

---

🚧 **Project in active development for 42 Porto** 🚧
