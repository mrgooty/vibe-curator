const { ApifyClient } = require('apify-client');
require('dotenv').config();

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

/**
 * Scrape Instagram data using Apify Instagram Scraper
 * @param {string} tag - Instagram hashtag or username to scrape
 * @returns {Promise<Object>} Scraped Instagram data
 */
async function scrapeInstagram(tag) {
  try {
    // Use Instagram Scraper actor
    const input = {
      hashtags: [tag],
      resultsLimit: 50,
      addParentData: false,
    };

    console.log(`Starting Instagram scrape for tag: ${tag}`);
    
    const run = await client.actor('apify/instagram-scraper').call(input);
    
    // Get the results from the dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    console.log(`Instagram scrape completed. Found ${items.length} items`);
    
    // Process and structure the data
    const processedData = items.map(item => ({
      id: item.id,
      shortCode: item.shortCode,
      caption: item.caption,
      hashtags: item.hashtags || [],
      likesCount: item.likesCount,
      commentsCount: item.commentsCount,
      timestamp: item.timestamp,
      displayUrl: item.displayUrl,
      ownerUsername: item.ownerUsername,
      location: item.locationName,
      type: item.type, // GraphImage, GraphVideo, GraphSidecar
    }));

    return {
      success: true,
      tag,
      count: processedData.length,
      data: processedData,
      scrapedAt: new Date().toISOString(),
    };

  } catch (error) {
    console.error('Instagram scraping failed:', error);
    throw new Error(`Instagram scraping failed: ${error.message}`);
  }
}

module.exports = scrapeInstagram;