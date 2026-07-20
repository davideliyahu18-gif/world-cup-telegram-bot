const config = require('./config');
const { bot, sendToChat } = require('./bot');
const { fetchCurrentAlert } = require('./services/orefService');
const { fetchNewItems } = require('./services/newsService');
const { formatAlert, formatNews } = require('./formatters');

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
    const items = await fetchNewItems();
    for (const item of items) {
      await sendToChat(formatNews(item));
    }
  } catch (err) {
    console.error('Error polling news feeds:', err.message);
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

  setInterval(pollAlerts, config.orefPollIntervalMs);
  setInterval(pollNews, config.newsPollIntervalMs);

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main();
