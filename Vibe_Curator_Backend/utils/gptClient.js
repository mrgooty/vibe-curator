const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.getVibeSummary = async (rawData) => {
  const prompt = `
  You're a Vibe Curator AI. Based on this social media + travel data, summarize top vibe themes, activities, and generate a suggested path for a user. Respond as structured JSON.

  Data: 
  ${JSON.stringify(rawData)}

  Respond with:
  {
    "title": "...",
    "duration": "...",
    "route": [{ "lat": ..., "lon": ..., "title": "..." }],
    "vibeTags": ["...", "..."],
    "images": ["..."],
    "summary": "..."
  }
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  });

  return JSON.parse(completion.choices[0].message.content);
};
