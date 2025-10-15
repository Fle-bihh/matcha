# Shared Package Documentation

Common code package shared between frontend and backend applications in the Matcha monorepo.

## 🎯 Purpose

The shared package provides:

-   **Type safety**: Common TypeScript interfaces and types
-   **Data validation**: Zod schemas for request/response validation
-   **Data models**: Consistent data structures across applications
-   **Logging**: Unified logging system for both server and client
-   **DTOs**: Data Transfer Objects for API communication

## 📦 Package Information

-   **Package name**: `@matcha/shared`
-   **Type**: CommonJS module
-   **Main export**: `dist/index.js`
-   **Primary dependency**: Zod for schema validation
-   **Consumers**: `@matcha/server` and `@matcha/web`

## 🏗️ Architecture Pattern

The shared package follows a **modular export pattern**:

-   Each feature area has its own folder with an index file
-   Barrel exports from main index.ts for clean imports
-   TypeScript-first development with compiled JavaScript output
-   Schema-driven validation with Zod

## 📁 Folder Structure

```
packages/shared/src/
├── index.ts              # Main package exports
├── dto/                  # Data Transfer Objects
├── logger/               # Unified logging system
├── models/               # Data models and interfaces
├── types/                # Common TypeScript types
└── validation/           # Zod validation schemas
```

## 🔧 Key Features

### Type Safety

-   Shared TypeScript interfaces between frontend and backend
-   Compile-time validation of data structures
-   Consistent API contracts across applications

### Schema Validation

-   Zod schemas for runtime validation
-   Request/response validation
-   Client-side form validation
-   Server-side input sanitization

### Data Models

-   User models and interfaces
-   Domain-specific data structures
-   Consistent naming conventions
-   Extensible model architecture

### Unified Logging

-   Consistent logging interface for both applications
-   Environment-aware log levels
-   Structured logging support

## 🚀 Development Scripts

```bash
npm run build    # TypeScript compilation + path aliases
npm run dev      # Watch mode for development
npm run start    # Run compiled JavaScript (for testing)
```

## 🔗 Dependencies

### Core Dependencies

-   **Zod**: Schema validation and type inference

### Development Dependencies

-   **tsc-alias**: TypeScript path alias resolution
-   **tsconfig-paths**: Module resolution for development

## 📚 Detailed Documentation

For implementation details, refer to:

-   `models/Models.doc.md` - Data models and interfaces _(coming soon)_
-   `validation/Validation.doc.md` - Zod schema patterns _(coming soon)_
-   `types/Types.doc.md` - TypeScript type definitions _(coming soon)_
-   `logger/Logger.doc.md` - Logging implementation _(coming soon)_
-   `dto/DTO.doc.md` - Data Transfer Objects _(coming soon)_

## 🔍 Usage Patterns

### In Server Application

```typescript
import { UserModel, CreateUserSchema } from "@matcha/shared";
import { logger } from "@matcha/shared";

// Use shared types and validation
const user: UserModel = await userService.create(validatedData);
logger.info("User created", { userId: user.id });
```

### In Web Application

```typescript
import { UserModel, CreateUserSchema } from "@matcha/shared";
import { ApiResponse } from "@matcha/shared/types";

// Share types for API responses
const response: ApiResponse<UserModel> = await api.createUser(data);
```

## 🏗️ Build Process

The shared package must be built before other packages can use it:

1. **Development**: Built automatically by `make install`
2. **Production**: Built as part of Docker container setup
3. **Watch mode**: Available for active development with `npm run dev`

## 🔄 Dependency Flow

```
@matcha/shared (built first)
    ↓
@matcha/server (depends on shared)
    ↓
@matcha/web (depends on shared, consumes server API)
```

This dependency order ensures type safety and validation consistency across the entire application stack.
