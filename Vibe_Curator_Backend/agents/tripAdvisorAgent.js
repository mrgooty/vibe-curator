const axios = require('axios');

async function scrapeTripAdvisor() {
  // Your Apify API token, ideally set in an environment variable
  const token = process.env.APIFY_TOKEN;
  // Your actor ID for the TripAdvisor scraper
  const actorId = 'maxcopell/tripadvisor';

  // Prepare the actor input
  const input = {
    query: "Chicago",
    maxItemsPerQuery: 10,
    language: "en",
    currency: "USD",
    locationFullName: "Chicago"
  };

  try {
    // Call Apify’s synchronous endpoint for actor runs.
    // Here we specify the actorId and input in the request body.
    const response = await axios.post(
      `https://api.apify.com/v2/actor-runs/sync-get-dataset-items?token=${token}`,
      {
        actorId: actorId,
        input: input
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // The response will include the dataset items directly.
    return response.data;
  } catch (error) {
    console.error("Error running TripAdvisor scraper:", error);
    throw error;
  }
}



module.exports = scrapeTripAdvisor;
