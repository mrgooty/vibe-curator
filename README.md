# Vibe Curator

A full-stack AI-powered social media content analysis platform that analyzes Instagram and TikTok posts for sentiment, emotions, topics, and overall vibe scores using advanced AI technologies.

## 🚀 Features

- **Multi-Platform Analysis**: Support for Instagram and TikTok content analysis
- **AI-Powered Insights**: Sentiment analysis, emotion detection, topic extraction, and vibe scoring
- **Cross-Platform Frontend**: React Native app that works on Android, iOS, and web
- **Modern Backend**: Node.js/Express with GraphQL, LangChain, and LangGraph integration
- **Containerized Deployment**: Docker setup for easy development and production deployment
- **Real-time Processing**: Live analysis with WebSocket support
- **Batch Processing**: Analyze multiple posts simultaneously

## 🏗️ Architecture

```
vibe-curator/
├── backend/                     # Node.js/Express backend with AI integration
│   ├── src/                     # Source code
│   ├── graphql/                 # GraphQL schemas and resolvers
│   ├── ai/                      # LangChain/LangGraph integration
│   ├── services/                # Apify and analysis services
│   └── Dockerfile               # Backend containerization
├── frontend/                    # React Native application
│   ├── src/                     # React Native source code
│   ├── web/                     # Web-specific configurations
│   └── Dockerfile               # Frontend containerization
├── shared/                      # Shared utilities and types
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Common utility functions
│   └── constants/               # Shared constants
├── docker-compose.yml           # Multi-container orchestration
├── package.json                 # Root package configuration
└── README.md                    # This file
```

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js framework
- **GraphQL** with Apollo Server
- **LangChain** for AI workflow orchestration
- **LangGraph** for complex AI agent workflows
- **OpenAI API** for natural language processing
- **Apify** for social media data scraping
- **TypeScript** for type safety

### Frontend
- **React Native** with Expo for cross-platform development
- **Apollo Client** for GraphQL integration
- **Redux Toolkit** for state management
- **React Navigation** for routing
- **TypeScript** for type safety

### Infrastructure
- **Docker** for containerization
- **Docker Compose** for multi-container orchestration
- **Nginx** for web server (production)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Docker and Docker Compose
- OpenAI API key
- Apify API token

### 1. Clone and Setup

```bash
git clone https://github.com/vibe-curator/vibe-curator.git
cd vibe-curator

# Install all dependencies
npm install

# This will install dependencies for backend, frontend, and shared modules
```

### 2. Environment Configuration

Create environment files from examples:

```bash
# Backend environment
cp backend/src/.env.example backend/src/.env

# Frontend environment
cp frontend/.env.example frontend/.env

# Root environment for Docker
cp .env.example .env
```

Edit the `.env` files with your API keys:

```bash
# backend/src/.env
OPENAI_API_KEY=sk-your_openai_api_key_here
APIFY_API_TOKEN=apify_api_your_token_here

# frontend/.env
API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### 3. Development Setup

```bash
# Start development servers
npm run dev

# This will start both backend and frontend in development mode
# Backend: http://localhost:3000
# Frontend: http://localhost:19006 (web), Expo DevTools: http://localhost:19000
```

### 4. Docker Setup (Alternative)

```bash
# Build and start with Docker
npm run docker:build
npm run docker:up

# Or in detached mode
npm run docker:up:detached

# View logs
npm run docker:logs
```

## 📱 Usage

### Web Interface
1. Open http://localhost:19006 in your browser
2. Enter Instagram or TikTok post URLs
3. Click "Analyze" to get AI-powered insights
4. View sentiment, emotions, topics, and vibe scores

### Mobile App
1. Install Expo Go on your mobile device
2. Scan the QR code from the Expo DevTools
3. Use the same interface on your mobile device

### API Access
- GraphQL Playground: http://localhost:3000/graphql
- REST API: http://localhost:3000/api
- Health Check: http://localhost:3000/health

## 🔧 Available Scripts

### Root Level Commands

```bash
# Setup and Installation
npm install              # Install all dependencies
npm run setup           # Full setup including build
npm run reset           # Clean and reinstall everything

# Development
npm run dev             # Start development servers
npm run start           # Start production servers
npm run build           # Build all projects

# Testing and Quality
npm run test            # Run all tests
npm run lint            # Lint all projects
npm run clean           # Clean all build artifacts

# Docker Operations
npm run docker:build    # Build Docker images
npm run docker:up       # Start containers
npm run docker:down     # Stop containers
npm run docker:logs     # View container logs

# Production Docker
npm run docker:prod     # Start production containers
npm run docker:prod:build # Build production images
```

### Individual Project Commands

```bash
# Backend
cd backend && npm run dev        # Start backend development
cd backend && npm run start      # Start backend production

# Frontend
cd frontend && npm run start     # Start Expo development
cd frontend && npm run web       # Start web development
cd frontend && npm run build     # Build for production

# Shared
cd shared && npm run build       # Build shared utilities
cd shared && npm run build:watch # Watch and rebuild
```

## 🐳 Docker Deployment

### Development Environment

```bash
# Start development environment
docker-compose up

# With rebuild
docker-compose up --build

# Detached mode
docker-compose up -d
```

### Production Environment

```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start production environment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Or use npm script
npm run docker:prod:up
```

### Container Management

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Restart services
docker-compose restart [service_name]

# Stop and remove containers
docker-compose down

# Remove volumes (careful!)
docker-compose down -v
```

## 🔑 Environment Variables

### Backend (.env)
```bash
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=sk-your_openai_api_key_here
APIFY_API_TOKEN=apify_api_your_token_here
CORS_ORIGIN=http://localhost:19006
```

### Frontend (.env)
```bash
API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_GRAPHQL_URL=http://localhost:3000/graphql
NODE_ENV=development
```

### Docker Compose (.env)
```bash
OPENAI_API_KEY=sk-your_openai_api_key_here
APIFY_API_TOKEN=apify_api_your_token_here
NODE_ENV=development
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Test individual components
npm run test:backend
npm run test:frontend
npm run test:shared

# Type checking
cd shared && npm run type-check
```

## 🔍 Health Checks

```bash
# Check if services are running
npm run health

# Manual health checks
curl http://localhost:3000/health    # Backend
curl http://localhost:19006/         # Frontend web
```

## 📊 Monitoring and Logs

```bash
# View all logs
npm run docker:logs

# View specific service logs
npm run logs:backend
npm run logs:frontend

# Follow logs in real-time
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using the ports
   lsof -i :3000  # Backend
   lsof -i :19006 # Frontend web
   
   # Kill processes if needed
   kill -9 $(lsof -t -i:3000)
   ```

2. **Docker issues**
   ```bash
   # Clean Docker system
   npm run clean:docker
   
   # Rebuild containers
   docker-compose build --no-cache
   ```

3. **Node modules issues**
   ```bash
   # Clean and reinstall
   npm run reset
   ```

4. **Environment variables not loading**
   - Ensure .env files are in correct locations
   - Check file permissions
   - Restart development servers

### Getting Help

1. Check the logs: `npm run docker:logs`
2. Verify environment variables are set correctly
3. Ensure all required services are running
4. Check network connectivity between containers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the AI capabilities
- Apify for social media data scraping
- The React Native and Node.js communities
- All contributors and supporters of this project

---

For more detailed documentation, check the README files in individual project directories:
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Shared Utilities Documentation](./shared/README.md)