const Parser = require('rss-parser');
const config = require('../config');

const parser = new Parser();
const seenGuids = new Set();

/**
 * Polls all configured RSS feeds and returns items not seen before.
 * Only the first poll of each feed seeds seenGuids without emitting,
 * so the bot doesn't dump an entire feed's history on startup.
 */
const seededFeeds = new Set();

async function fetchNewItems() {
  const newItems = [];

  for (const feed of config.newsFeeds) {
    try {
      const parsed = await parser.parseURL(feed.url);
      const isFirstPoll = !seededFeeds.has(feed.url);

      for (const item of parsed.items || []) {
        const guid = item.guid || item.link || item.title;
        if (!guid || seenGuids.has(guid)) continue;
        seenGuids.add(guid);

        if (!isFirstPoll) {
          newItems.push({
            title: item.title,
            summary: item.contentSnippet,
            source: feed.name,
            link: item.link,
            time: item.isoDate ? new Date(item.isoDate) : new Date(),
          });
        }
      }

      seededFeeds.add(feed.url);
    } catch (err) {
      console.error(`Failed to fetch feed ${feed.name}: ${err.message}`);
    }
  }

  pruneSeenGuids();
  return newItems;
}

function pruneSeenGuids() {
  const MAX_TRACKED = 2000;
  if (seenGuids.size > MAX_TRACKED) {
    const excess = seenGuids.size - MAX_TRACKED;
    const iterator = seenGuids.values();
    for (let i = 0; i < excess; i += 1) {
      seenGuids.delete(iterator.next().value);
    }
  }
}

module.exports = { fetchNewItems };
