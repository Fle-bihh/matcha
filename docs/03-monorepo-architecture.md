# 🏗️ Monorepo Architecture

This project uses a **monorepo** to host the **web, server, and shared resources** in a single repository.  
This setup makes development easier, enforces consistency, and allows **shared types and constants** between applications.

---

## 📁 Folder Structure

```plaintext
/my-dating-app
 ├── apps/
 │   ├── web/         # React app (detailed in web doc)
 │   └── server/          # Express app (detailed in server doc)
 │
 ├── packages/
 │   └── shared/           # Shared resources (types, enums, constants, endpoint names)
 │
 ├── docker/
 │   ├── web.Dockerfile
 │   ├── server.Dockerfile
 │   └── mysql.Dockerfile (optional, if custom)
 │
 ├── docs/                 # All project documentation
 │
 ├── .env                  # Local environment variables (not committed)
 ├── .env.example          # Template for environment variables
 ├── package.json          # Root package.json (workspaces + scripts)
 ├── docker-compose.yml    # Dev/test/prod orchestration
 ├── tsconfig.json         # Root TypeScript configuration
 └── README.md
```

---

## 📦 Workspaces Setup

The monorepo uses **npm workspaces** to manage dependencies across apps and packages.

### Example `package.json` Snippet

```jsonc
{
	"private": true,
	"workspaces": ["apps/*", "packages/*"],
	"scripts": {
		"dev": "concurrently \"npm:dev:*\"",
		"dev:web": "npm --workspace apps/web run dev",
		"dev:server": "npm --workspace apps/server run dev",
		"lint": "eslint . --ext .ts,.tsx",
		"type-check": "tsc --noEmit"
	}
}
```

### Usage

Run commands like:

```bash
npm run dev:web
npm run dev:server
npm run lint
npm run type-check
```

---

## 🔗 Dependency Flow

The following diagram shows the dependency direction between parts of the monorepo:

```mermaid
flowchart LR
    subgraph Shared["packages/shared"]
      T[Types & Enums]
      C[Constants & Endpoints]
    end

    FE[apps/web] --> Shared
    BE[apps/server] --> Shared
```

**Rule:**  
`packages/shared` must never import anything from web or server — this ensures it stays truly reusable.

---

## 🔑 Environment Variables Strategy

-   **.env (ignored by Git):** Stores local secrets (database password, JWT secret, SMTP credentials).
-   **.env.example (committed):** Provides a template of required environment variables with placeholder values, so contributors know what to set.
-   Each app (web, server) will have its own `.env` file, but may read from a root `.env` for shared values.
-   Use a safe loader (like **dotenv-safe**) in server to ensure all required variables are defined.

---

## 📚 Purpose of This Document

This document sets the foundation for:

-   🗂 How the repo is structured
-   🔗 How apps share code
-   🔑 How environment variables are handled
-   🏃 How development commands are organized

The next documentation files will go deeper into **web structure** and **server architecture**, following the rules defined here.
