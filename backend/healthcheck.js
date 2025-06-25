#!/usr/bin/env node

// Health check script for Vibe Curator backend
// Used by Docker to verify container health

const http = require('http');

const options = {
  host: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  timeout: 2000,
  method: 'GET'
};

const request = http.request(options, (res) => {
  console.log(`Health check status: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    process.exit(0); // Success
  } else {
    process.exit(1); // Failure
  }
});

request.on('error', (err) => {
  console.error('Health check failed:', err.message);
  process.exit(1); // Failure
});

request.on('timeout', () => {
  console.error('Health check timed out');
  request.destroy();
  process.exit(1); // Failure
});

request.setTimeout(options.timeout);
request.end();