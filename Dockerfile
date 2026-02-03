# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Clean default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# We will mount the custom nginx.conf at runtime or copy it here. 
# For this setup, we'll rely on the main nginx reverse proxy to handle serving this, 
# or if this container IS the web server:
# Valid approach: This container serves static files on port 80.
# The main Nginx Proxy (if separate) routes to this.
# HOWEVER, for simplicity in docker-compose, we can just use the main Nginx service 
# to serve these files directly via volumes, OR have this container serve them.

# Let's go with: This container is just a static file server.
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
