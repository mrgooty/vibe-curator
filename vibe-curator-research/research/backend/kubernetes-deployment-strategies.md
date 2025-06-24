# Kubernetes Deployment Strategies for Node.js Microservices 2024

## Microservices Architecture Principles on Kubernetes

### Service Decomposition Strategy
- **Single Responsibility Services**: Each microservice handles one specific business capability
- **Database per Service**: Give each service its own dedicated database for data isolation
- **Independent Deployment**: Services can be deployed, scaled, and updated independently
- **Fault Isolation**: Service failures don't cascade to other services
- **Technology Diversity**: Services can use different technologies as appropriate

### API Gateway Implementation
- **Centralized Entry Point**: Single point of entry for all client requests
- **Request Routing**: Intelligent routing to appropriate microservices
- **Cross-Cutting Concerns**: Handle authentication, logging, rate limiting, and monitoring
- **Protocol Translation**: Convert between different communication protocols
- **Load Balancing**: Distribute traffic across service instances

## Containerization with Docker

### Docker Image Optimization for Kubernetes

#### Multi-Stage Build Strategy
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

#### Security Best Practices
- **Non-Root User**: Run containers as non-privileged users
- **Minimal Base Images**: Use Alpine Linux for smaller attack surface
- **Security Scanning**: Regular vulnerability scanning of container images
- **Read-Only Filesystems**: Mount filesystems as read-only where possible

### Container Registry Management
- **Image Versioning**: Use semantic versioning for container images
- **Registry Security**: Implement secure container registries
- **Image Signing**: Sign container images for integrity verification
- **Automated Builds**: CI/CD pipeline integration for automated image builds

## Helm Charts for Deployment Management

### Helm Chart Structure
```
charts/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   └── secret.yaml
└── charts/
```

### Template Configuration
```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "app.fullname" . }}
  labels:
    {{- include "app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "app.selectorLabels" . | nindent 8 }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - containerPort: {{ .Values.service.port }}
        env:
        - name: NODE_ENV
          value: {{ .Values.env.nodeEnv }}
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
```

### Values Configuration
```yaml
# values.yaml
replicaCount: 3

image:
  repository: vibe-curator/api
  tag: "1.0.0"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 3000

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: api.vibe-curator.com
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
```

## Kubernetes Deployment Configurations

### Deployment Manifests

#### Basic Deployment Configuration
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: vibe-curator
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: vibe-curator/user-service:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: host
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service Discovery Configuration

#### Service Manifest
```yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: vibe-curator
spec:
  selector:
    app: user-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

#### Ingress Configuration
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: vibe-curator
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - api.vibe-curator.com
    secretName: api-tls
  rules:
  - host: api.vibe-curator.com
    http:
      paths:
      - path: /users
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 80
      - path: /content
        pathType: Prefix
        backend:
          service:
            name: content-service
            port:
              number: 80
```

## Auto-Scaling Strategies

### Horizontal Pod Autoscaler (HPA)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-service-hpa
  namespace: vibe-curator
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Vertical Pod Autoscaler (VPA)
```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: user-service-vpa
  namespace: vibe-curator
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: user-service
      maxAllowed:
        cpu: 1
        memory: 1Gi
      minAllowed:
        cpu: 100m
        memory: 128Mi
```

### Cluster Autoscaler Configuration
- **Node Scaling**: Automatically scale cluster nodes based on resource demands
- **Cost Optimization**: Scale down unused nodes to reduce costs
- **Multi-Zone Support**: Distribute nodes across availability zones
- **Instance Type Selection**: Choose appropriate instance types for workloads

## Service Mesh Implementation

### Istio Service Mesh

#### Service Mesh Benefits
- **Traffic Management**: Advanced traffic routing and load balancing
- **Security**: Mutual TLS and policy enforcement
- **Observability**: Distributed tracing and metrics collection
- **Resilience**: Circuit breakers, retries, and timeouts

#### Istio Configuration
```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: user-service
  namespace: vibe-curator
spec:
  http:
  - match:
    - headers:
        version:
          exact: v2
    route:
    - destination:
        host: user-service
        subset: v2
      weight: 100
  - route:
    - destination:
        host: user-service
        subset: v1
      weight: 100
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: user-service
  namespace: vibe-curator
spec:
  host: user-service
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
```

## Monitoring and Observability

### Prometheus Monitoring Stack

#### Prometheus Configuration
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
```

#### Grafana Dashboard Configuration
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards
  namespace: monitoring
data:
  node-exporter.json: |
    {
      "dashboard": {
        "title": "Node.js Application Metrics",
        "panels": [
          {
            "title": "Request Rate",
            "type": "graph",
            "targets": [
              {
                "expr": "rate(http_requests_total[5m])"
              }
            ]
          }
        ]
      }
    }
```

### Distributed Tracing with Jaeger

#### Jaeger Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
    spec:
      containers:
      - name: jaeger
        image: jaegertracing/all-in-one:latest
        ports:
        - containerPort: 16686
        - containerPort: 14268
        env:
        - name: COLLECTOR_ZIPKIN_HTTP_PORT
          value: "9411"
```

## Security Best Practices

### Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: user-service-netpol
  namespace: vibe-curator
spec:
  podSelector:
    matchLabels:
      app: user-service
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api-gateway
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
```

### Pod Security Standards
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: user-service
  namespace: vibe-curator
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001
    fsGroup: 1001
  containers:
  - name: user-service
    image: vibe-curator/user-service:1.0.0
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
```

### Secret Management
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
  namespace: vibe-curator
type: Opaque
data:
  host: <base64-encoded-host>
  username: <base64-encoded-username>
  password: <base64-encoded-password>
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-credentials
  namespace: vibe-curator
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: db-credentials
  data:
  - secretKey: password
    remoteRef:
      key: database
      property: password
```

## CI/CD Pipeline Integration

### GitOps Workflow with ArgoCD
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: vibe-curator-api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/vibe-curator/k8s-manifests
    targetRevision: HEAD
    path: api
  destination:
    server: https://kubernetes.default.svc
    namespace: vibe-curator
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

### Deployment Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build and push Docker image
      run: |
        docker build -t ${{ secrets.REGISTRY }}/user-service:${{ github.sha }} .
        docker push ${{ secrets.REGISTRY }}/user-service:${{ github.sha }}
    
    - name: Deploy to Kubernetes
      run: |
        helm upgrade --install user-service ./charts/user-service \
          --set image.tag=${{ github.sha }} \
          --namespace vibe-curator
```

## Performance Optimization

### Resource Management
- **Resource Requests and Limits**: Set appropriate CPU and memory constraints
- **Quality of Service**: Configure QoS classes for predictable performance
- **Node Affinity**: Place pods on appropriate nodes based on requirements
- **Pod Disruption Budgets**: Ensure service availability during updates

### Caching Strategies
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-cache
  namespace: vibe-curator
spec:
  replicas: 3
  selector:
    matchLabels:
      app: redis-cache
  template:
    metadata:
      labels:
        app: redis-cache
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## Disaster Recovery and Backup

### Backup Strategies
- **Persistent Volume Snapshots**: Regular snapshots of persistent data
- **Database Backups**: Automated database backup procedures
- **Configuration Backups**: Version control for Kubernetes manifests
- **Cross-Region Replication**: Multi-region deployment for disaster recovery

### High Availability Configuration
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: vibe-curator
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - user-service
              topologyKey: kubernetes.io/hostname
```

This comprehensive guide provides the foundation for deploying and managing Node.js microservices on Kubernetes, incorporating modern best practices, security measures, and optimization techniques for 2024.