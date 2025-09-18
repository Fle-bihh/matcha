FROM node:20-alpine

WORKDIR /app

ARG API_PORT
ENV API_PORT=${API_PORT}

COPY package*.json tsconfig.json ./
COPY packages ./packages
COPY apps/server ./apps/server
COPY .env .env
COPY .env.example .env.example

RUN npm install --workspace packages/shared --workspace apps/server

EXPOSE ${API_PORT}

CMD ["npm", "--workspace", "apps/server", "run", "dev"]
