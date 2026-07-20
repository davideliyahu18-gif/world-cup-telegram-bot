require('dotenv').config();

const config = {
  botToken: process.env.BOT_TOKEN,
  chatId: process.env.CHAT_ID,
  orefPollIntervalMs: Number(process.env.OREF_POLL_INTERVAL_MS) || 10000,
  newsPollIntervalMs: Number(process.env.NEWS_POLL_INTERVAL_MS) || 300000,
  brandName: 'דוד - מערכת שוע"ל אזרחי',
  brandEmoji: '🛡️',
  telegramSourceChannel: process.env.TELEGRAM_SOURCE_CHANNEL || 'CaptainLoui',
};

module.exports = config;
