FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

RUN npm install

COPY packages ./packages
COPY apps ./apps

RUN npm run build -w @matcha/shared
RUN npm run build -w @matcha/server

EXPOSE ${SERVER_PORT}

WORKDIR /app/apps/server

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev; else npm start; fi"]
