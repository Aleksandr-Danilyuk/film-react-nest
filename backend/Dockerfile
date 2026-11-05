# ---- Этап 1: сборка ----
FROM node:20-alpine AS builder
WORKDIR /app

# Сначала копируем только файлы зависимостей — это включает кэширование слоёв
COPY package*.json ./
RUN npm ci

# Потом копируем исходники и собираем
COPY . .
RUN npm run build

# Удаляем dev-зависимости, оставляя только то, что нужно для рантайма
RUN npm prune --omit=dev

# ---- Этап 2: итоговый образ ----
FROM node:20-alpine

WORKDIR /app

# Копируем ТОЛЬКО собранное и production-зависимости
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

# Запускаем скомпилированный JS, а не ts-node/nest start
#   CMD [ "npm", "run", "start:prod" ]
CMD ["node", "dist/main.js"]