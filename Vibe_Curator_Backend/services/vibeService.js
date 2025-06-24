const vibeDao = require('../daos/vibeDao');
const instagramAgent = require('../agents/instagramAgent');
const tiktokAgent = require('../agents/tiktokAgent');
const tripAdvisorAgent = require('../agents/tripAdvisorAgent');
const { getVibeSummary } = require('../utils/gptClient');

exports.generateVibePaths = async (userId, location, preferences) => {
  // 1. Gather data from Apify agents
  const [igData, ttData, taData] = await Promise.all([
    instagramAgent.scrape(preferences.tag || 'fun things to do'),
    tiktokAgent.scrape(preferences.tag || 'city vibes'),
    tripAdvisorAgent.scrape(location.city || 'San Jose')
  ]);

  const rawData = [...igData, ...ttData, ...taData];

  // 2. Send to GPT to summarize into a vibe path
  const vibePath = await getVibeSummary(rawData);

  // 3. Save result
  await vibeDao.save(userId, [vibePath]);

  return [vibePath]; // return as array for frontend
};
