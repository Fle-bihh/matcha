FROM node:20-alpine

WORKDIR /app/packages/shared

# Copy root package.json for workspace setup
COPY package*.json ../../
COPY tsconfig*.json ../../

# Copy shared package.json
COPY packages/shared/package.json ./

# Install dependencies from root
WORKDIR /app
RUN npm ci

# Go back to shared package directory
WORKDIR /app/packages/shared

# Copy TypeScript configuration
COPY packages/shared/tsconfig.json ./

# Copy source code
COPY packages/shared/src ./src

# Build initial output
RUN npm run build

# Default command: watch mode for development
CMD ["npm", "run", "dev"]
