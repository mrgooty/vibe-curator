# Multi-stage build for React Native Expo frontend with web support
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Development stage
FROM base AS development

# Install Expo CLI globally
RUN npm install -g @expo/cli@latest

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose Expo development ports
EXPOSE 19000 19001 19002 8081

# Start Expo development server
CMD ["dumb-init", "npx", "expo", "start", "--web"]

# Production dependencies stage
FROM base AS deps

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Production build stage
FROM base AS builder

# Install Expo CLI globally
RUN npm install -g @expo/cli@latest

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build for web production
RUN npx expo export:web

# Production stage with nginx
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY web/nginx.conf /etc/nginx/nginx.conf

# Copy built web files from builder stage
COPY --from=builder /app/web-build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]