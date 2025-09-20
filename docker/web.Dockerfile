FROM node:20-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/

RUN npm install

COPY . .

ARG WEB_PORT
ENV WEB_PORT=${WEB_PORT}
EXPOSE ${WEB_PORT}

CMD ["npm", "--workspace", "apps/web", "run", "dev"]
