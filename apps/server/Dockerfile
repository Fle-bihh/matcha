FROM node:20-alpine

WORKDIR /app

# Install dependencies for waiting on services
RUN apk add --no-cache curl

# Copy root package.json for workspace setup
COPY package*.json ./
COPY tsconfig*.json ./

# Copy package.json files for all workspaces
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

# Install all dependencies
RUN npm ci

# Copy shared package TypeScript config and source
COPY packages/shared/tsconfig.json ./packages/shared/
COPY packages/shared/src ./packages/shared/src

# Copy server TypeScript config and source
COPY apps/server/tsconfig.json ./apps/server/
COPY apps/server/src ./apps/server/src

# Create uploads directory
RUN mkdir -p /app/apps/server/uploads/profile-pictures

# Health check - simplified, just check if server responds
HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:${SERVER_PORT:-3000}/api/v1/health/ || exit 1

# Set working directory to server
WORKDIR /app/apps/server

# Development command
CMD ["npm", "run", "dev"]
