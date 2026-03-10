FROM node:24-slim

WORKDIR /app
COPY . .

RUN npm ci

ENTRYPOINT ["node", "hook.js"]
