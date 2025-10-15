# Root Documentation

Technical documentation for files and folders present at the root of the Matcha project.

## 📁 Project Structure

### `/apps/`

Contains the main applications of the monorepo:

-   **`server/`**: Node.js/Express backend API with TypeScript
-   **`web/`**: React frontend application with Vite

### `/packages/`

Contains shared packages:

-   **`shared/`**: Common code between frontend and backend (types, models, validation, logger)

### `/docs/`

Project documentation and resources:

-   **`postman/`**: Postman collection for API testing

## 📄 Configuration Files

### `package.json`

Main monorepo configuration with npm workspaces:

```json
{
	"workspaces": ["packages/shared", "apps/server", "apps/web"]
}
```

**Available scripts:**

-   `npm run build`: TypeScript build for all packages

### `docker-compose.yml`

Docker infrastructure configuration with:

-   **MySQL 8.0**: Database (port 3306)
-   **Adminer**: Web interface for MySQL (port 8080)
-   **Server**: Backend API (port 3000)
-   **Web**: React application (port 3001)

**Persistent volumes:**

-   `mysql_data`: Persistent MySQL data
-   Bind mounts for development with hot-reload

### `Makefile`

Development and deployment scripts:

**Local commands (VS Code):**

-   `make clean`: Cleans node_modules, dist, and build files
-   `make install`: Installs dependencies and builds shared

**Docker commands:**

-   `make up`: Launch environment without logs
-   `make with-logs`: Launch environment with visible logs
-   `make show-logs`: Display container logs
-   `make down`: Stop all containers
-   `make re`: Restart environment (down + up --build)
-   `make no-cache`: Complete reset (removes volumes and Docker cache)
-   `make clear-cache`: Clean Docker cache only

### `tsconfig.json` & `tsconfig.base.json`

Shared TypeScript configuration:

-   **Base**: Common configuration for all packages
-   **Root**: References monorepo projects for IDE

**Enabled features:**

-   Experimental decorators
-   Node module resolution
-   Source map generation
-   Strict types enabled

## 🔧 Technical Architecture

### Monorepo with npm workspaces

-   **Advantages**: Code sharing, synchronization, simplified management
-   **Build system**: TypeScript Project References
-   **Hot-reload**: TSX for server, Vite for web

### Docker container system

-   **Development**: Hot-reload with bind mounts
-   **Database**: MySQL 8.0 with persistence
-   **Administration**: Adminer web interface

### Dependency injection

-   Implemented in both applications (server & web)
-   Container/Registry pattern for modular architecture
-   Custom decorators for configuration

## 📚 Associated Documentation

This root documentation will be completed by:

-   `apps/server/Server.doc.md`: Detailed backend architecture
-   `apps/web/Web.doc.md`: Detailed frontend architecture
-   `packages/shared/Shared.doc.md`: Detailed shared package

## 🚀 Quick Start Commands

1. **Local installation** (avoids TypeScript errors in VS Code):

    ```bash
    make install
    ```

2. **Development with Docker**:

    ```bash
    make re
    ```

3. **Access services**:
    - API: http://localhost:3000/api/v1
    - Web: http://localhost:3001
    - Database: http://localhost:8080 (Adminer)

## 🔍 Debugging and Monitoring

### Docker logs

```bash
make show-logs          # All logs
docker compose logs web # Frontend logs
docker compose logs api # Backend logs
docker compose logs db  # MySQL logs
```

### Complete reset

```bash
make no-cache  # Remove everything and rebuild
```

### TypeScript build

```bash
npm run build  # Build all packages
tsc --build    # Incremental build
```
