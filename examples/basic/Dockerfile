# Fly.io — Node builds the site, then Caddy serves dist/ with the Caddyfile.
# Railway builds this Dockerfile too, whenever it finds one.

FROM node:24-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /app/dist
