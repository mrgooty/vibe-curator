const express = require('express');
const axios = require('axios');
const router = express.Router();

const clientId = process.env.SALESFORCE_CLIENT_ID;
const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
const redirectUri = process.env.SALESFORCE_REDIRECT_URI;

router.get('/login', (req, res) => {
  const salesforceAuthUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  res.redirect(salesforceAuthUrl);
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post('https://login.salesforce.com/services/oauth2/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      },
    });

    const { access_token, refresh_token, instance_url } = response.data;
    // For now, return tokens (in prod, store them securely!)
    res.json({ access_token, refresh_token, instance_url });
  } catch (error) {
    console.error('OAuth Error:', error.response?.data || error.message);
    res.status(500).send('OAuth callback failed');
  }
});

module.exports = router;
