# Node builds the site, then Caddy serves dist/ with the Caddyfile. Fly.io,
# Heroku (via heroku.yml) and Google Cloud Run deploy this image, and so does
# Railway, which builds a Dockerfile whenever it finds one.

FROM node:24-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /app/dist
