const axios = require('axios');

async function scrapeTikTok(hashtag) {
  // Use your actor identifier from Apify. Here it's set to "clockworks/tiktok-scraper".
  const actorId = 'clockworks/tiktok-scraper';
  // Your API token should be stored as an environment variable for security.
  const token = process.env.APIFY_TOKEN;

  // Prepare the input for your actor
  const input = {
    hashtags: [hashtag],
    resultsPerPage: 100,
    proxyCountryCode: 'None'
  };

  try {
    // Call Apify's synchronous endpoint.
    // This URL runs the actor and, once finished, returns the results dataset.
    const response = await axios.post(
      `https://api.apify.com/v2/actor-tasks/${actorId}/run-sync-get-dataset-items?token=${token}`,
      input,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Return the scraped dataset items
    return response.data;
  } catch (error) {
    console.error('Error running TikTok scraper:', error);
    throw error;
  }
}

// Example usage:
scrapeTikTok('fyp')
  .then(data => {
    console.log('Scraped data:', data);
  })
  .catch(error => {
    console.error('Scraping failed:', error);
  });

module.exports = scrapeTikTok;
