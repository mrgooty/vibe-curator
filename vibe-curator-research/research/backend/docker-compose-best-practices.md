# Docker and Docker Compose Best Practices for Node.js 2024

## Dockerfile Optimization for Node.js

### Multi-Stage Build Strategy
Multi-stage builds are essential for creating optimized, production-ready Node.js containers:

```dockerfile
# Multi-stage build example
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
USER node
CMD ["node", "server.js"]
```

### Base Image Selection
- **Official Node.js Images**: Use official Node.js Docker images for security and reliability
- **Alpine Linux**: Prefer Alpine-based images for smaller size and security
- **Version Pinning**: Pin specific Node.js versions for consistency
- **LTS Versions**: Use Long Term Support versions for production

**Recommended Base Images:**
- `node:18-alpine` - Lightweight Alpine-based image
- `node:18-slim` - Debian-based minimal image
- `node:18` - Full Debian-based image with build tools

### Image Optimization Techniques

#### Layer Caching Optimization
```dockerfile
# Optimize layer caching by copying package files first
COPY package*.json ./
RUN npm ci --only=production

# Copy application code after dependencies
COPY . .
```

#### .dockerignore Configuration
Create comprehensive .dockerignore files to exclude unnecessary files:

```dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.nyc_output
.coverage
.vscode
.idea
*.log
dist
build
.DS_Store
Thumbs.db
```

#### Security Best Practices
- **Non-Root User**: Run containers as non-root user
- **Minimal Packages**: Install only necessary packages
- **Security Updates**: Regularly update base images
- **Vulnerability Scanning**: Scan images for security vulnerabilities

```dockerfile
# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Switch to non-root user
USER nextjs
```

## Docker Compose Configuration

### Development Environment Setup

#### Basic Docker Compose Structure
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - database
      - redis

  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: vibe_curator
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Production Environment Configuration

#### Production Docker Compose
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    depends_on:
      - database
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Environment-Specific Configurations

#### Development Workflow Optimization
- **Volume Mounting**: Mount source code for live reloading
- **Hot Reloading**: Configure nodemon for automatic restarts
- **Debug Support**: Enable debugging capabilities
- **Development Dependencies**: Include development tools

```yaml
# Development-specific service configuration
app:
  build:
    context: .
    dockerfile: Dockerfile.dev
  volumes:
    - .:/app
    - /app/node_modules  # Anonymous volume for node_modules
  environment:
    - NODE_ENV=development
    - DEBUG=app:*
  command: npm run dev
```

#### Production Optimization
- **Resource Limits**: Set memory and CPU limits
- **Health Checks**: Implement comprehensive health checks
- **Restart Policies**: Configure automatic restart on failure
- **Security Context**: Run with minimal privileges

```yaml
# Production-specific service configuration
app:
  deploy:
    resources:
      limits:
        memory: 512M
        cpus: '0.5'
      reservations:
        memory: 256M
        cpus: '0.25'
  restart: unless-stopped
  security_opt:
    - no-new-privileges:true
```

## Container Orchestration Patterns

### Service Dependencies Management

#### Dependency Ordering
```yaml
services:
  app:
    depends_on:
      database:
        condition: service_healthy
      redis:
        condition: service_started
    
  database:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
```

#### Wait Strategies
Implement proper wait strategies for service dependencies:

```dockerfile
# Add wait-for-it script
COPY wait-for-it.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Use in command
CMD ["wait-for-it.sh", "database:5432", "--", "node", "server.js"]
```

### Network Configuration

#### Custom Networks
```yaml
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true

services:
  app:
    networks:
      - frontend
      - backend
  
  database:
    networks:
      - backend
```

#### Service Discovery
- **DNS Resolution**: Services can communicate using service names
- **Internal Networks**: Isolate backend services from external access
- **Port Mapping**: Expose only necessary ports to host

## Development Workflow Integration

### Live Reloading Setup

#### Nodemon Configuration
```json
{
  "name": "vibe-curator-api",
  "scripts": {
    "dev": "nodemon --inspect=0.0.0.0:9229 server.js",
    "start": "node server.js"
  },
  "nodemonConfig": {
    "ignore": ["node_modules", "logs"],
    "ext": "js,json",
    "env": {
      "NODE_ENV": "development"
    }
  }
}
```

#### Development Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install nodemon globally for development
RUN npm install -g nodemon

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000 9229

CMD ["npm", "run", "dev"]
```

### Testing Integration

#### Test Environment Configuration
```yaml
# docker-compose.test.yml
version: '3.8'

services:
  app-test:
    build:
      context: .
      dockerfile: Dockerfile.test
    environment:
      - NODE_ENV=test
    depends_on:
      - test-database
    command: npm test

  test-database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: test_db
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_password
    tmpfs:
      - /var/lib/postgresql/data
```

## Performance Optimization

### Container Resource Management

#### Memory and CPU Limits
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
```

#### Health Check Configuration
```yaml
healthcheck:
  test: ["CMD", "node", "healthcheck.js"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Image Size Optimization

#### Multi-Stage Build Benefits
- **Smaller Images**: Remove build dependencies from final image
- **Security**: Reduce attack surface by excluding unnecessary tools
- **Performance**: Faster image pulls and container startup
- **Cost**: Reduced storage and bandwidth costs

#### Build Optimization Techniques
```dockerfile
# Use specific package manager commands
RUN npm ci --only=production --silent

# Clean package manager cache
RUN npm cache clean --force

# Remove unnecessary files
RUN rm -rf /tmp/* /var/cache/apk/*
```

## Security Best Practices

### Container Security

#### User Management
```dockerfile
# Create dedicated user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set ownership
COPY --chown=appuser:appgroup . .

# Switch to non-root user
USER appuser
```

#### Secret Management
```yaml
services:
  app:
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

### Network Security

#### Internal Networks
```yaml
networks:
  internal:
    driver: bridge
    internal: true
  
services:
  database:
    networks:
      - internal
    # No ports exposed to host
```

#### TLS Configuration
```yaml
services:
  app:
    environment:
      - HTTPS_CERT_FILE=/certs/cert.pem
      - HTTPS_KEY_FILE=/certs/key.pem
    volumes:
      - ./certs:/certs:ro
```

## Monitoring and Logging

### Container Monitoring

#### Health Checks
```javascript
// healthcheck.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  timeout: 2000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', () => {
  process.exit(1);
});

req.end();
```

#### Logging Configuration
```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Observability Integration

#### Metrics Collection
```yaml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

## CI/CD Integration

### Build Pipeline Integration

#### GitHub Actions Example
```yaml
name: Build and Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and test
        run: |
          docker-compose -f docker-compose.test.yml build
          docker-compose -f docker-compose.test.yml run --rm app-test
```

#### Docker Registry Integration
```yaml
services:
  app:
    image: ${REGISTRY}/vibe-curator:${TAG:-latest}
    build:
      context: .
      dockerfile: Dockerfile
```

### Deployment Strategies

#### Blue-Green Deployment
```yaml
# docker-compose.blue.yml
services:
  app-blue:
    image: vibe-curator:blue
    ports:
      - "3000:3000"

# docker-compose.green.yml  
services:
  app-green:
    image: vibe-curator:green
    ports:
      - "3001:3000"
```

#### Rolling Updates
```bash
#!/bin/bash
# rolling-update.sh
docker-compose pull
docker-compose up -d --no-deps app
docker-compose exec app npm run migrate
```

## Troubleshooting and Debugging

### Common Issues and Solutions

#### Container Startup Issues
- **Port Conflicts**: Check for port conflicts with host system
- **Volume Permissions**: Ensure proper file permissions for mounted volumes
- **Environment Variables**: Verify all required environment variables are set
- **Service Dependencies**: Check service dependency order and health checks

#### Performance Issues
- **Resource Limits**: Monitor container resource usage
- **Network Latency**: Check inter-service communication performance
- **Volume Performance**: Consider volume driver performance implications
- **Image Size**: Optimize image size for faster startup times

### Debugging Techniques

#### Container Inspection
```bash
# Inspect running containers
docker-compose ps
docker-compose logs app
docker-compose exec app sh

# Check resource usage
docker stats
docker-compose top
```

#### Network Debugging
```bash
# Test service connectivity
docker-compose exec app ping database
docker-compose exec app nslookup database

# Check network configuration
docker network ls
docker network inspect project_default
```

This comprehensive guide provides the foundation for implementing robust Docker and Docker Compose configurations for Node.js applications, incorporating modern best practices and optimization techniques for 2024.