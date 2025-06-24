require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const apifyRoutes = require('./routes/apify');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/apify', apifyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vibe Curator backend running on port ${PORT}`);
});
