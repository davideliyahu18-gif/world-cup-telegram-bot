const config = require('./config');
const { bot, sendToChat } = require('./bot');
const { fetchCurrentAlert } = require('./services/orefService');
const { fetchNewPosts } = require('./services/telegramChannelService');
const { formatAlert, formatNews } = require('./formatters');
const { createServer } = require('./server');

async function pollAlerts() {
  try {
    const alert = await fetchCurrentAlert();
    if (alert) {
      await sendToChat(formatAlert(alert));
    }
  } catch (err) {
    console.error('Error polling oref alerts:', err.message);
  }
}

async function pollNews() {
  try {
    const items = await fetchNewPosts();
    for (const item of items) {
      await sendToChat(formatNews(item));
    }
  } catch (err) {
    console.error('Error polling source channel:', err.message);
  }
}

function main() {
  // bot.launch() only resolves when the bot is stopped, so it must not be
  // awaited here - awaiting it would block the console.log and interval
  // setup below indefinitely.
  bot.launch().catch((err) => {
    console.error('Fatal error starting bot:', err);
    process.exit(1);
  });

  console.log(`${config.brandEmoji} ${config.brandName} is running.`);

  createServer().listen(config.port, () => {
    console.log(`🗺️  Live map available at http://localhost:${config.port}`);
  });

  setInterval(pollAlerts, config.orefPollIntervalMs);
  setInterval(pollNews, config.newsPollIntervalMs);

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main();
