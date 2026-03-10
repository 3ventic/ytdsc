FROM node:22-slim

WORKDIR /app
COPY . .

RUN npm ci

ENTRYPOINT ["node", "hook.js"]
