const { ApifyClient } = require('apify-client');
require('dotenv').config();

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

/**
 * Scrape TikTok data using Apify TikTok Scraper
 * @param {string} hashtag - TikTok hashtag to scrape
 * @param {number} limit - Number of videos to scrape (default: 50)
 * @returns {Promise<Object>} Scraped TikTok data
 */
async function scrapeTikTok(hashtag, limit = 50) {
  try {
    const input = {
      hashtags: [hashtag],
      resultsPerPage: limit,
      shouldDownloadCovers: false,
      shouldDownloadSlideshowImages: false,
      shouldDownloadSubtitles: false,
      shouldDownloadVideos: false,
    };

    console.log(`Starting TikTok scrape for hashtag: ${hashtag}`);
    
    const run = await client.actor('clockworks/free-tiktok-scraper').call(input);
    
    // Get the results from the dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    console.log(`TikTok scrape completed. Found ${items.length} items`);
    
    // Process and structure the data
    const processedData = items.map(item => ({
      id: item.id,
      text: item.text,
      createTime: item.createTime,
      authorMeta: {
        id: item.authorMeta?.id,
        name: item.authorMeta?.name,
        nickName: item.authorMeta?.nickName,
        verified: item.authorMeta?.verified,
        signature: item.authorMeta?.signature,
        avatar: item.authorMeta?.avatar,
        following: item.authorMeta?.following,
        fans: item.authorMeta?.fans,
        heart: item.authorMeta?.heart,
        video: item.authorMeta?.video,
      },
      musicMeta: {
        musicId: item.musicMeta?.musicId,
        musicName: item.musicMeta?.musicName,
        musicAuthor: item.musicMeta?.musicAuthor,
        musicOriginal: item.musicMeta?.musicOriginal,
      },
      covers: {
        default: item.covers?.default,
        origin: item.covers?.origin,
        dynamic: item.covers?.dynamic,
      },
      webVideoUrl: item.webVideoUrl,
      videoUrl: item.videoUrl,
      videoUrlNoWaterMark: item.videoUrlNoWaterMark,
      videoMeta: {
        height: item.videoMeta?.height,
        width: item.videoMeta?.width,
        duration: item.videoMeta?.duration,
      },
      diggCount: item.diggCount,
      shareCount: item.shareCount,
      playCount: item.playCount,
      commentCount: item.commentCount,
      hashtags: item.hashtags || [],
    }));

    return {
      success: true,
      hashtag,
      count: processedData.length,
      data: processedData,
      scrapedAt: new Date().toISOString(),
    };

  } catch (error) {
    console.error('TikTok scraping failed:', error);
    throw new Error(`TikTok scraping failed: ${error.message}`);
  }
}

/**
 * Scrape TikTok user profile data
 * @param {string} username - TikTok username to scrape
 * @returns {Promise<Object>} Scraped TikTok user data
 */
async function scrapeTikTokUser(username) {
  try {
    const input = {
      profiles: [username],
      resultsPerPage: 30,
      shouldDownloadCovers: false,
      shouldDownloadSlideshowImages: false,
      shouldDownloadSubtitles: false,
      shouldDownloadVideos: false,
    };

    console.log(`Starting TikTok user scrape for: ${username}`);
    
    const run = await client.actor('clockworks/free-tiktok-scraper').call(input);
    
    // Get the results from the dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    console.log(`TikTok user scrape completed. Found ${items.length} items`);
    
    return {
      success: true,
      username,
      count: items.length,
      data: items,
      scrapedAt: new Date().toISOString(),
    };

  } catch (error) {
    console.error('TikTok user scraping failed:', error);
    throw new Error(`TikTok user scraping failed: ${error.message}`);
  }
}

module.exports = {
  scrapeTikTok,
  scrapeTikTokUser,
};