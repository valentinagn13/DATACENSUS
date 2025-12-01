# Multi-stage Dockerfile for Vite + React app
# Build with Node, serve static files with nginx

FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies (copy package.json and package-lock if present)
COPY package*.json ./
# Prefer npm ci for reproducible installs, fall back to npm install
RUN npm ci --silent || npm install --silent

# Copy source and build
COPY . .
RUN npm run build


FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config (provided in repo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
