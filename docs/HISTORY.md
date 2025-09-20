# 📜 Project History

## 🗓 \[2025-09-17] Project Kickoff

-   📂 **Initialized repository** and created `README`
-   🎯 **Defined project goals:** modularity, reusability, professional code structure
-   🗂 **Planned monorepo architecture** with `apps/web`, `apps/server`, and `packages/shared`
-   🔜 **Next step:** document design decisions, DB schema, and coding rules

---

## 🗓 \[2025-09-18] Monorepo Setup & MVP

-   🏗 **Created monorepo folder structure**:

    -   `apps/web` → React + Webpack + TypeScript
    -   `apps/server` → Express + TypeScript
    -   `packages/shared` → shared constants and types
    -   `docker/` → Dockerfiles for web and server

-   📝 **Configured npm workspaces** for dependency sharing
-   🐳 **Added Docker Compose** to run frontend, backend, and MySQL together

    -   Used `.env` to configure all ports and credentials (no hardcoded values)
    -   Backend listens on `0.0.0.0` to be reachable from `web` container
    -   Webpack proxy updated to target `server` service instead of `localhost`

-   🔐 **Centralized environment variables** with `dotenv-safe` (server) and Webpack `DefinePlugin` (web)
-   🗄 **Created MySQL schema** with a `users` table and test users (`Alice`, `Bob`)
-   ⚙️ **Implemented backend DB integration**:

    -   `db.ts` with MySQL connection pool
    -   `/api/users` route returning user list from DB

-   🖥 **Connected frontend to backend**:

    -   `index.tsx` fetches `/api/hello` and `/api/users` and logs results

-   🌐 **Added Adminer UI** (`db-admin` service) for easy DB browsing at `http://localhost:${DB_ADMIN_PORT}`
