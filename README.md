# Matcha

**Full-stack TypeScript application** with monorepo architecture and Express.js backend.

## 🏗️ Architecture

**Monorepo structure**:

-   **Server**: Express.js REST API
-   **Web**: Frontend application
-   **Shared**: Common utilities

## 🚀 Features

-   **Decorator-based routing** with automatic registration
-   **Input validation** with Zod schemas
-   **Database operations** with MySQL integration
-   **Soft delete** functionality
-   **Health check** endpoints
-   **Docker** containerization

## 📁 Project Structure

```
matcha/
├── apps/server/         # Express.js API
├── apps/web/           # Frontend app
├── packages/shared/    # Common utilities
└── docker-compose.yml  # Container setup
```

## 🛠️ Tech Stack

-   **Express.js** with TypeScript
-   **MySQL** database
-   **Zod** validation
-   **Docker** containerization

## 🔧 Quick Start

```bash
docker-compose up      # Start all services
npm run build          # Build packages
npm run dev            # Development mode
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild services
docker-compose up --build

# View logs
docker-compose logs server

# Access containers
docker-compose exec server sh
docker-compose exec db mysql -u root -p
```

## 🌐 API

**Base URL:** `/api/v1`

-   `GET /` - Greeting endpoint
-   `GET /health` - Health status
-   `GET /db-test` - Database test

� **API Documentation**: Available in code or call any route with `OPTIONS` method

## 🔒 Configuration

Set up `.env` file with database credentials and ports.
