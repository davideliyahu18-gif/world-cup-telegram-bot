require('dotenv').config();

const config = {
  botToken: process.env.BOT_TOKEN,
  chatId: process.env.CHAT_ID,
  orefPollIntervalMs: Number(process.env.OREF_POLL_INTERVAL_MS) || 10000,
  newsPollIntervalMs: Number(process.env.NEWS_POLL_INTERVAL_MS) || 300000,
  brandName: 'דוד - מערכת שוע"ל אזרחי',
  brandEmoji: '🛡️',
  newsFeeds: [
    { name: 'Ynet', url: 'https://www.ynet.co.il/Integration/StoryRss2.xml' },
    { name: 'וואלה חדשות', url: 'https://rss.walla.co.il/feed/1?type=main' },
    { name: 'כאן חדשות', url: 'https://www.kan.org.il/rss/news.xml' },
  ],
};

module.exports = config;
