FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

RUN npm install

COPY packages ./packages
COPY apps ./apps

ARG VITE_WEB_PORT
ARG VITE_WEB_URL
ARG VITE_SERVER_PORT
ARG VITE_SERVER_URL

ENV VITE_WEB_PORT=${VITE_WEB_PORT}
ENV VITE_WEB_URL=${VITE_WEB_URL}
ENV VITE_SERVER_PORT=${VITE_SERVER_PORT}
ENV VITE_SERVER_URL=${VITE_SERVER_URL}

RUN npm run build -w @matcha/shared
RUN npm run build -w @matcha/web

EXPOSE ${WEB_PORT}

WORKDIR /app/apps/web

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev; else npm run start; fi"]
