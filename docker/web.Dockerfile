FROM node:20-alpine

WORKDIR /app

ARG WEB_PORT
ENV WEB_PORT=${WEB_PORT}

COPY package*.json tsconfig.json ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN npm install --workspace packages/shared --workspace apps/web

EXPOSE ${WEB_PORT}

CMD ["npm", "--workspace", "apps/web", "run", "dev"]
