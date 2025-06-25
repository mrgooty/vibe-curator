# Multi-stage build for Node.js Express backend with GraphQL, LangChain, and LangGraph
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

# Copy package files
COPY package*.json ./
COPY src/package*.json ./src/

# Install all dependencies (including dev dependencies)
RUN npm ci
RUN cd src && npm ci

# Copy source code
COPY . .

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Start development server
CMD ["dumb-init", "npm", "run", "dev"]

# Production dependencies stage
FROM base AS deps

# Copy package files
COPY package*.json ./
COPY src/package*.json ./src/

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force
RUN cd src && npm ci --only=production && npm cache clean --force

# Production stage
FROM base AS production

# Copy production dependencies
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nodejs:nodejs /app/src/node_modules ./src/node_modules

# Copy source code
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start production server
CMD ["dumb-init", "npm", "start"]