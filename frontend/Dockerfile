# ---- Этап 1: сборка ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Vite зашивает переменные на этапе сборки,
# поэтому их нужно передавать как build-args, а не как environment в compose
ARG VITE_BASE_URL=/
ARG VITE_API_URL=/api/afisha
ARG VITE_CDN_URL=/content/afisha
ENV VITE_BASE_URL=$VITE_BASE_URL VITE_API_URL=$VITE_API_URL VITE_CDN_URL=$VITE_CDN_URL

RUN npm run build
# Результат в /app/dist

# ---- Этап 2: только статика, без исходников и node_modules ----
FROM alpine:3.20
COPY --from=build /app/dist /app/dist
