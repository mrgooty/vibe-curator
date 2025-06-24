const axios = require('axios');

async function scrapeInstagram(hashtag) {
  const actorId = 'clockworks/instagram-post-scraper';
  const token = process.env.APIFY_TOKEN;

  const response = await axios.post(
    `https://api.apify.com/v2/actor-tasks/${actorId}/run-sync-get-dataset-items?token=${token}`,
    {
      search: hashtag,
      type: 'hashtag',
      maxItems: 10,
    }
  );

  return response.data;
}

module.exports = scrapeInstagram;
