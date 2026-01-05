FROM node:20-alpine

WORKDIR /app

# Copy root package.json for workspace setup
COPY package*.json ./
COPY tsconfig*.json ./

# Copy package.json files for all workspaces
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

# Install all dependencies
RUN npm ci

# Copy shared package TypeScript config and source
COPY packages/shared/tsconfig.json ./packages/shared/
COPY packages/shared/src ./packages/shared/src

# Copy web TypeScript config and source
COPY apps/web/tsconfig.json ./apps/web/
COPY apps/web/vite.config.ts ./apps/web/
COPY apps/web/index.html ./apps/web/
COPY apps/web/public ./apps/web/public
COPY apps/web/src ./apps/web/src

# Set working directory to web
WORKDIR /app/apps/web

# Expose the Vite dev server port
EXPOSE ${VITE_WEB_PORT:-3001}

# Development command
CMD ["npm", "run", "dev", "--", "--host"]

# Production build command
# CMD ["sh", "-c", "npm run build && npm run start -- --host"]
