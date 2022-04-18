# ------- BUILDER -------
FROM node:14-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

RUN rm -rf node_modules

RUN yarn install --production

# ------- RELEASE -------
FROM node:14-alpine AS release

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules

COPY --from=builder /app/dist /app/dist

EXPOSE 8080

CMD ["node", "/app/dist/index.js"]
