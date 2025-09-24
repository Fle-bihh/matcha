FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the shared package
WORKDIR /app/packages/shared
RUN npm run build

# Build the web app
WORKDIR /app/apps/web
RUN npm run build

EXPOSE ${WEB_PORT}

ENV NODE_ENV=production
ENV PORT=${WEB_PORT}

CMD ["npm", "start"]
