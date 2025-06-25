require('dotenv').config();
const express = require('express');
const cors = require('cors');
const createApolloServer = require('../graphql/server');

const authRoutes = require('./routes/auth');
const apifyRoutes = require('./routes/apify');

const app = express();
app.use(cors());
app.use(express.json());

// REST API routes
app.use('/auth', authRoutes);
app.use('/api/apify', apifyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

async function startServer() {
  try {
    // Create and start Apollo GraphQL server
    const apolloServer = createApolloServer();
    await apolloServer.start();
    
    // Apply GraphQL middleware to Express app
    apolloServer.applyMiddleware({ app, path: '/graphql' });
    
    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, () => {
      console.log(`🚀 Vibe Curator backend running on port ${PORT}`);
      console.log(`📊 GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
      console.log(`🔍 GraphQL Playground: http://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
