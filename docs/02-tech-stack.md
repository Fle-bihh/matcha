# 🛠️ Tech Stack & Rationale

---

## 🖥️ Frontend

### **Stack**

-   ⚛️ **React + TypeScript** – Component-based architecture with strong typing for safer, maintainable code
-   🎨 **Material UI (MUI)** – Prebuilt, responsive, accessible components to minimize custom styling work
-   🗃️ **Redux Toolkit (with Entity Adapter)** – Scalable state management with normalized data structures
-   🧭 **React Router** – Client-side navigation; will be wrapped in a custom router adapter for future-proofing
-   🌐 **Axios (via custom adapter)** – Abstracted HTTP client to make future migrations (e.g., to `fetch` or GraphQL) painless

### **Rationale**

This combination provides a **scalable, type-safe frontend** with minimal UI decision overhead.  
The **adapter-based design** ensures flexibility and reusability in future projects.

---

## 🖧 Backend

### **Stack**

-   🚏 **Express + TypeScript** – Lightweight, flexible, and easy to layer with controllers, services, and repositories
-   🔑 **JWT Authentication** – Stateless, scalable, and compatible with future OAuth providers
-   🔄 **Socket.io** – Real-time event handling (chat, notifications) with room support and reconnection logic
-   📝 **Manual SQL + Custom Query Layer** – Full control over queries, schemas, and optimizations, while still centralizing DB access

### **Rationale**

This setup encourages **clean separation of concerns** and provides a **modular, maintainable backend**.  
The use of **Socket.io** allows for **real-time communication**, essential for chat and notifications.

---

## 🗄️ Database

### **Choice**

**MySQL**

### **Design Principles**

-   🧩 Strong **relational modeling** (normalized tables for users, profiles, tags, likes, matches, visits, blocks, messages, notifications, reports)
-   🕒 Consistent **metadata columns:** `created_at`, `updated_at`, `deleted_at` (soft delete support)
-   ⚡ **Indexing** for common queries (search, filtering, sorting by location, fame rating, tags)

### **Rationale**

MySQL is a **widely supported relational database** that balances **performance, reliability, and ease of use**.  
Its relational model suits the project’s data (user profiles, many-to-many tags, matches).

---

## 🧩 Shared Resources

### **Location**

`/packages/shared`

### **Contents**

-   📝 **TypeScript interfaces** for all models (minus sensitive fields like password hashes)
-   🔢 **Enums** (genders, orientations, fame rating levels)
-   🌐 **API endpoint names** and request/response types
-   📡 **WebSocket event names** and payload types

### **Rationale**

A shared package guarantees **type safety across frontend and backend**, reducing bugs and easing future refactoring.

---

## 📦 Containerization

### **Stack**

-   🐳 **Docker + docker-compose**
-   🖥️ **Containers** for frontend, backend, and MySQL
-   🔀 **Separate dev and prod configurations**
-   📂 **Volume mounts** for live development

### **Rationale**

Containerization ensures that **development, testing, and production environments are identical**, making onboarding and debugging **simple and predictable**.
