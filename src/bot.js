const { Telegraf } = require('telegraf');
const config = require('./config');

if (!config.botToken) {
  throw new Error('BOT_TOKEN is not set. Copy .env.example to .env and fill it in.');
}

const bot = new Telegraf(config.botToken);

bot.start((ctx) => {
  ctx.reply(
    [
      `${config.brandEmoji} ברוכים הבאים ל${config.brandName}`,
      '',
      'הבוט מרליי התרעות פיקוד העורף ועדכוני חדשות לערוץ זה.',
      '⚠️ מידע לא רשמי - למידע רשמי ומחייב פנו לפיקוד העורף.',
      '',
      `ה-Chat ID של הצ'אט הזה: ${ctx.chat.id}`,
    ].join('\n')
  );
});

bot.command('status', (ctx) => {
  ctx.reply(`${config.brandEmoji} הבוט פעיל ומאזין להתרעות ולעדכוני חדשות.`);
});

async function sendToChat(message) {
  if (!config.chatId) {
    console.warn('CHAT_ID is not set - skipping send. Message was:\n', message);
    return;
  }
  await bot.telegram.sendMessage(config.chatId, message, { parse_mode: 'MarkdownV2' });
}

module.exports = { bot, sendToChat };
