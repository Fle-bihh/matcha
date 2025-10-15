# Server Application Documentation

Backend API application built with Node.js, Express, and TypeScript, serving the Matcha dating platform.

## 🎯 Purpose

The server application provides a REST API that handles:

-   User authentication and authorization
-   Business logic for the dating platform
-   Database interactions through repositories
-   Security middleware and rate limiting
-   File upload handling (profile pictures)

## 📦 Package Information

-   **Package name**: `@matcha/server`
-   **Type**: CommonJS module
-   **Port**: 3000 (configurable via environment)
-   **Main dependencies**: Express 5, MySQL2, Zod, JWT, Bcrypt

## 🏗️ Architecture Pattern

The server follows a **dependency inversion architecture** with:

-   **Controllers**: Handle HTTP requests and responses using custom decorators
-   **Services**: Contain business logic and orchestrate operations
-   **Repositories**: Manage data access and database operations
-   **Middleware**: Handle cross-cutting concerns (security, validation, auth)
-   **Container**: Dependency injection system for loose coupling

## 📁 Folder Structure

```
apps/server/src/
├── config.ts              # Application configuration
├── index.ts               # Application entry point
├── constants/             # Application constants
├── container/             # Dependency injection container
├── controllers/           # HTTP request handlers with decorators
├── decorators/            # Custom decorators (@Route, @Auth, @Validate)
├── middleware/            # Express middleware functions
├── registry/              # Route and controller registration
├── repositories/          # Data access layer
├── services/              # Business logic layer
├── setup/                 # Application setup and initialization
├── types/                 # Server-specific TypeScript types
└── utils/                 # Utility functions and helpers
```

## 🔧 Key Features

### Custom Decorator System

-   `@Route()`: Define HTTP endpoints with method and path
-   `@Auth()`: Require authentication for endpoints
-   `@Validate()`: Apply Zod schema validation to requests

### Security Features

-   JWT-based authentication
-   Password hashing with bcrypt
-   Rate limiting per endpoint
-   CORS configuration
-   Helmet security headers
-   XSS protection
-   HPP (HTTP Parameter Pollution) protection

### Database Integration

-   MySQL 8.0 with connection pooling
-   Repository pattern for data access
-   Raw SQL queries (no ORM for better control)

## 🚀 Development Scripts

```bash
npm run dev         # Development with hot-reload (TSX)
npm run dev:debug   # Development with Node.js inspector
npm run dev:verbose # Development with verbose logging
npm run build       # TypeScript compilation + path aliases
npm run start       # Production server (requires build)
```

## 🔗 Dependencies

### Core Dependencies

-   **Express 5**: Web framework with modern features
-   **MySQL2**: Database driver with Promise support
-   **Zod**: Schema validation (shared with frontend)
-   **JWT**: Token-based authentication

### Security Dependencies

-   **Bcrypt**: Password hashing
-   **Helmet**: Security headers
-   **CORS**: Cross-origin requests
-   **Express-rate-limit**: Rate limiting
-   **XSS**: Cross-site scripting protection

## 📚 Detailed Documentation

For implementation details, refer to:

-   `controllers/Controllers.doc.md` - HTTP controllers and routing _(coming soon)_
-   `services/Services.doc.md` - Business logic layer _(coming soon)_
-   `repositories/Repositories.doc.md` - Data access patterns _(coming soon)_
-   `decorators/Decorators.doc.md` - Custom decorator system _(coming soon)_
-   `setup/Setup.doc.md` - Application initialization _(coming soon)_

## 🔍 Usage in Development

The server application is consumed by:

-   **Web frontend**: Via REST API calls
-   **Development tools**: Postman collection in `/docs/postman/`
-   **Database admin**: Through Adminer web interface

## 🐳 Docker Integration

The server runs in a Docker container with:

-   Hot-reload via bind mounts for development
-   Environment variables from root `.env` file
-   Automatic restart on code changes (TSX watch mode)
-   Health checks for container monitoring
