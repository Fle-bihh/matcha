# Web Application Documentation

Frontend React application built with Vite, TypeScript, and Redux Toolkit for the Matcha dating platform.

## 🎯 Purpose

The web application provides a modern user interface for:

-   User registration and profile management
-   Browsing and matching with other users
-   Real-time messaging and notifications
-   Profile customization and photo management
-   Responsive design for desktop and mobile

## 📦 Package Information

-   **Package name**: `@matcha/web`
-   **Type**: ES module
-   **Port**: 3001 (configurable via environment)
-   **Build tool**: Vite 5 with React plugin
-   **Main dependencies**: React 18, Redux Toolkit, React Router

## 🏗️ Architecture Pattern

The web application follows a **modular architecture** with:

-   **Pages**: Top-level route components and layouts
-   **Components**: Reusable UI components organized by feature
-   **Store**: Redux Toolkit for global state management
-   **Services**: API communication and external integrations
-   **Hooks**: Custom React hooks for shared logic
-   **Container**: Client-side dependency injection system

## 📁 Folder Structure

```
apps/web/src/
├── main.tsx               # Application entry point
├── vite-env.d.ts         # Vite environment types
├── components/           # Reusable UI components
├── constants/            # Frontend constants and configuration
├── container/            # Client-side dependency injection
├── decorators/           # Custom decorators for actions/components
├── hooks/                # Custom React hooks
├── layouts/              # Page layout components
├── pages/                # Route-level page components
├── services/             # API services and external integrations
├── store/                # Redux store configuration and slices
├── types/                # Frontend-specific TypeScript types
└── utils/                # Utility functions and helpers
```

## 🔧 Key Features

### State Management

-   Redux Toolkit for predictable state updates
-   RTK Query for efficient API data fetching
-   Async thunks for complex operations
-   Normalized state structure

### Routing System

-   React Router v7 for client-side navigation
-   Nested routes with layout components
-   Protected routes with authentication guards
-   Dynamic route parameters

### Development Experience

-   Vite for fast development and hot-reload
-   TypeScript for type safety
-   Redux DevTools integration
-   Environment variable support

### UI Architecture

-   Component-based architecture
-   Reusable component library
-   Responsive design patterns
-   Modern CSS techniques

## 🚀 Development Scripts

```bash
npm run dev      # Development server with hot-reload
npm run build    # Production build optimization
npm run start    # Preview production build locally
```

## 🔗 Dependencies

### Core Dependencies

-   **React 18**: Modern React with concurrent features
-   **Redux Toolkit**: Efficient Redux development
-   **React Router**: Client-side routing
-   **React Redux**: React bindings for Redux

### Development Dependencies

-   **Vite**: Fast build tool and dev server
-   **TypeScript**: Type safety and enhanced DX
-   **@vitejs/plugin-react**: React integration for Vite

## 📚 Detailed Documentation

For implementation details, refer to:

-   `components/Components.doc.md` - UI component architecture _(coming soon)_
-   `store/Store.doc.md` - Redux state management _(coming soon)_
-   `services/Services.doc.md` - API integration patterns _(coming soon)_
-   `hooks/Hooks.doc.md` - Custom React hooks _(coming soon)_
-   `pages/Pages.doc.md` - Routing and page structure _(coming soon)_

## 🔍 Usage in Development

The web application:

-   **Consumes**: REST API from `@matcha/server`
-   **Shares**: Types and validation with `@matcha/shared`
-   **Builds**: Static assets for production deployment
-   **Serves**: User interface on development port 3001

## 🐳 Docker Integration

The web application runs in a Docker container with:

-   Vite development server for hot-reload
-   Environment variables from `apps/web/.env`
-   Bind mounts for live code updates
-   Production build serving via Vite preview

## 🌐 Environment Configuration

The application uses environment variables for:

-   **VITE_API_URL**: Backend API endpoint
-   Additional Vite variables prefixed with `VITE_`
-   Runtime configuration for different environments
