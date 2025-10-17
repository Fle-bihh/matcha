FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

RUN npm install

COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

ARG VITE_WEB_PORT
ARG VITE_WEB_URL
ARG VITE_SERVER_URL

ENV VITE_WEB_PORT=${VITE_WEB_PORT}
ENV VITE_WEB_URL=${VITE_WEB_URL}
ENV VITE_SERVER_URL=${VITE_SERVER_URL}

CMD ["sh", "-c", "cd /app/packages/shared && npm run dev & cd /app/apps/web && npm run dev"]
