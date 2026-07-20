const fetch = require('node-fetch');
const cheerio = require('cheerio');
const config = require('../config');

const seenPostIds = new Set();
let seeded = false;

/**
 * Scrapes the public preview page (t.me/s/<channel>) since the Bot API
 * has no way for a bot to read posts from a channel it doesn't administer.
 * The first poll only seeds seenPostIds so startup doesn't dump the
 * channel's whole recent history at once.
 */
async function fetchNewPosts() {
  const url = `https://t.me/s/${config.telegramSourceChannel}`;
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const posts = [];

  $('.tgme_widget_message').each((_, el) => {
    const postId = $(el).attr('data-post');
    if (!postId || seenPostIds.has(postId)) return;
    seenPostIds.add(postId);

    if (!seeded) return;

    const text = $(el).find('.tgme_widget_message_text').first().text().trim();
    if (!text) return;

    const datetime = $(el).find('.tgme_widget_message_date time').attr('datetime');

    posts.push({
      title: text,
      summary: null,
      source: `Telegram: @${config.telegramSourceChannel}`,
      link: `https://t.me/${postId}`,
      time: datetime ? new Date(datetime) : new Date(),
    });
  });

  seeded = true;
  pruneSeenIds();
  return posts;
}

function pruneSeenIds() {
  const MAX_TRACKED = 500;
  if (seenPostIds.size > MAX_TRACKED) {
    const excess = seenPostIds.size - MAX_TRACKED;
    const iterator = seenPostIds.values();
    for (let i = 0; i < excess; i += 1) {
      seenPostIds.delete(iterator.next().value);
    }
  }
}

module.exports = { fetchNewPosts };
