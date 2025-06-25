const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create Apollo Server instance
const createApolloServer = () => {
  return new ApolloServer({
    schema,
    context: ({ req }) => {
      // Extract user from JWT token if present
      const token = req.headers.authorization?.replace('Bearer ', '');
      let user = null;
      
      if (token) {
        try {
          // JWT verification would be implemented here
          // For now, we'll pass the token through
          user = { token };
        } catch (error) {
          console.error('JWT verification failed:', error);
        }
      }
      
      return {
        user,
        req,
      };
    },
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        code: error.extensions?.code,
        path: error.path,
      };
    },
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',
  });
};

module.exports = createApolloServer;