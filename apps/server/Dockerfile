FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

RUN npm install

COPY packages/shared ./packages/shared
COPY apps/server ./apps/server

CMD ["sh", "-c", "cd /app/packages/shared && npm run dev & cd /app/apps/server && npm run dev"]
