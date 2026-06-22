FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app

RUN mkdir -p /app/data && chown -R node:node /app

USER node

COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/dist ./dist

RUN npm install --production

EXPOSE 3000
CMD ["node", "dist/index.js"]