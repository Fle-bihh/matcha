FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

RUN npm install

COPY packages ./packages
COPY apps ./apps

RUN npm run build -w @matcha/shared
RUN npm run build -w @matcha/web

EXPOSE ${WEB_PORT}

WORKDIR /app/apps/web

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev; else npm run start; fi"]
