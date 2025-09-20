FROM node:20-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/

RUN npm install

COPY . .

ARG API_PORT
ENV API_PORT=${API_PORT}
EXPOSE ${API_PORT}

CMD ["npm", "--workspace", "apps/server", "run", "dev"]
