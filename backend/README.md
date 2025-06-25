# Vibe Curator Backend

Extended Node.js/Express backend with GraphQL, LangChain, and LangGraph integration for AI-powered content analysis.

## Features

- **GraphQL API**: Complete GraphQL layer with Apollo Server
- **AI Integration**: LangChain and LangGraph workflows for content analysis
- **Social Media Scraping**: Instagram and TikTok data retrieval via Apify
- **Content Analysis**: Sentiment analysis, categorization, and vibe generation
- **Cross-Platform Analytics**: Multi-platform content comparison and insights
- **REST API**: Backward-compatible REST endpoints
- **Real-time Analysis**: AI-powered workflows for social media content

## Architecture

```
backend/
├── src/                     # Core application code
│   ├── controllers/         # Request handlers
│   ├── services/           # Business logic and enhanced Apify services
│   ├── routes/             # REST API routes
│   ├── agents/             # Apify scraping agents
│   ├── utils/              # Utilities and enhanced GPT client
│   └── server.js           # Main server file
├── graphql/                # GraphQL implementation
│   ├── schema.js           # GraphQL type definitions
│   ├── resolvers.js        # GraphQL resolvers
│   └── server.js           # Apollo Server configuration
└── ai/                     # AI and LangChain integration
    ├── langchainClient.js  # LangChain integration
    └── workflows.js        # LangGraph workflows
```

## Installation

1. **Install dependencies:**
   ```bash
   cd vibe-curator/backend/src
   npm install
   ```

2. **Environment setup:**
   Create a `.env` file in the `src` directory:
   ```env
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key
   APIFY_API_TOKEN=your_apify_token
   NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:3000/graphql`
- **Playground**: Available in development mode

### REST API Endpoints

#### Instagram Scraping
- `GET /api/apify/instagram?tag={hashtag}` - Basic Instagram scraping
- `GET /api/apify/instagram/enhanced?tag={hashtag}&includeAI=true` - Enhanced with AI analysis

#### TikTok Scraping
- `GET /api/apify/tiktok?hashtag={hashtag}&limit=50` - Basic TikTok hashtag scraping
- `GET /api/apify/tiktok/enhanced?hashtag={hashtag}&includeAI=true` - Enhanced with AI analysis
- `GET /api/apify/tiktok/user?username={username}` - TikTok user profile scraping
- `GET /api/apify/tiktok/user/enhanced?username={username}&includeAI=true` - Enhanced user analysis

#### Cross-Platform Analysis
- `POST /api/apify/cross-platform` - Analyze content across multiple platforms

#### Health Checks
- `GET /health` - Server health check
- `GET /api/apify/health` - Apify services health check

## GraphQL Schema

### Key Types

```graphql
type InstagramPost {
  id: ID!
  shortCode: String!
  caption: String
  hashtags: [String!]!
  likesCount: Int!
  commentsCount: Int!
  timestamp: String!
  displayUrl: String!
  ownerUsername: String!
  location: String
  type: String!
}

type TikTokPost {
  id: ID!
  text: String
  createTime: String!
  authorMeta: TikTokAuthor
  diggCount: Int!
  shareCount: Int!
  playCount: Int!
  commentCount: Int!
  hashtags: [String!]!
}

type VibeSummary {
  title: String!
  duration: String!
  route: [VibeRoute!]!
  vibeTags: [String!]!
  images: [String!]!
  summary: String!
}
```

### Sample Queries

```graphql
# Scrape Instagram content
query {
  scrapeInstagram(tag: "travel") {
    success
    count
    data {
      caption
      hashtags
      likesCount
      ownerUsername
    }
  }
}

# Generate vibe analysis
mutation {
  analyzeContent(input: {
    rawData: "{\"posts\": [...]}",
    preferences: "adventure travel"
  }) {
    title
    vibeTags
    summary
  }
}
```

## AI Workflows

### Content Analysis Pipeline

The AI workflow processes social media content through multiple stages:

1. **Preprocessing**: Clean and structure raw content
2. **Sentiment Analysis**: Analyze emotional tone and engagement patterns
3. **Content Categorization**: Classify content themes and topics
4. **Vibe Generation**: Create personalized experience recommendations
5. **Final Report**: Comprehensive analysis with actionable insights

### LangChain Integration

- **Structured Output**: Uses Zod schemas for consistent AI responses
- **Error Handling**: Automatic fallback to legacy methods
- **Multi-step Workflows**: Complex analysis pipelines with LangGraph

## Enhanced Services

### Enhanced Apify Service

Combines raw data scraping with AI analysis:

```javascript
const { getEnhancedInstagramData } = require('./services/enhancedApifyService');

// Get Instagram data with AI insights
const result = await getEnhancedInstagramData('travel', {
  includeAIAnalysis: true
});
```

### Cross-Platform Analysis

Analyze content across multiple social media platforms:

```javascript
const platforms = [
  { platform: 'instagram', data: instagramData },
  { platform: 'tiktok', data: tiktokData }
];

const insights = await performCrossPlatformAnalysis(platforms);
```

## Dependencies

### Core Dependencies
- `express`: ^5.1.0 - Web framework
- `apollo-server-express`: ^3.12.1 - GraphQL server
- `graphql`: ^16.8.1 - GraphQL implementation
- `@graphql-tools/schema`: ^10.0.2 - Schema utilities

### AI & LangChain
- `langchain`: ^0.1.25 - LangChain framework
- `@langchain/core`: ^0.1.52 - Core LangChain functionality
- `@langchain/openai`: ^0.0.19 - OpenAI integration
- `@langchain/langgraph`: ^0.0.19 - Workflow orchestration
- `openai`: ^4.93.0 - OpenAI API client
- `zod`: ^3.22.4 - Schema validation

### Data & Scraping
- `apify-client`: ^2.7.1 - Apify API client
- `@apify/sdk`: ^3.1.10 - Apify SDK
- `axios`: ^1.8.4 - HTTP client

### Utilities
- `cors`: ^2.8.5 - CORS middleware
- `dotenv`: ^16.5.0 - Environment variables
- `nodemon`: ^3.1.9 - Development auto-reload

## Error Handling

The backend implements comprehensive error handling:

- **GraphQL Errors**: Structured error responses with codes and paths
- **REST API Errors**: JSON error responses with status codes
- **AI Workflow Errors**: Graceful fallbacks and error logging
- **Scraping Errors**: Detailed error messages for debugging

## Development

### Running in Development Mode

```bash
npm run dev
```

This starts the server with:
- Auto-reload on file changes
- GraphQL Playground enabled
- Detailed error logging
- CORS enabled for frontend development

### Testing GraphQL

Visit `http://localhost:3000/graphql` to access the GraphQL Playground where you can:
- Explore the schema
- Test queries and mutations
- View documentation

### Environment Variables

Required environment variables:

```env
PORT=3000                    # Server port
OPENAI_API_KEY=sk-...       # OpenAI API key for AI features
APIFY_API_TOKEN=apify_api_... # Apify token for scraping
NODE_ENV=development         # Environment mode
```

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Disable GraphQL Playground
3. Configure proper CORS origins
4. Set up proper logging
5. Use process managers like PM2

## Contributing

When extending the backend:

1. Add new GraphQL types to `graphql/schema.js`
2. Implement resolvers in `graphql/resolvers.js`
3. Create services in `src/services/`
4. Add REST routes in `src/routes/`
5. Update this README with new features

## License

This project is part of the Vibe Curator application.