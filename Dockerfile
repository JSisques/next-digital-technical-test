FROM node:20-alpine AS builder

RUN npm i -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm i
COPY . .

RUN pnpm run build

FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm i --prod

COPY --from=builder /usr/src/app/dist ./dist

RUN chown -R appuser:appgroup /usr/src/app

USER appuser

EXPOSE 3000

CMD [ "node", "dist/main" ]