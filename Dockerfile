FROM node:20-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json package-lock.json ./
COPY ./src ./src
COPY ./i18n ./i18n
COPY ./nest-cli.json ./
COPY ./tsconfig.build.json ./
COPY ./tsconfig.json ./
COPY ./.env.production ./.env

RUN npm install -g @nestjs/cli
RUN npm ci --only=production

RUN npm run build

VOLUME /app/upload

ENV PORT 3000

CMD ["node", "dist/main"]