FROM node:12-slim

WORKDIR /app
COPY . .

RUN npm ci

ENTRYPOINT ["node", "hook.js"]
