const fetch = require('node-fetch');

const ALERTS_URL = 'https://www.oref.org.il/WarningMessages/alert/alerts.json';

const REQUEST_HEADERS = {
  Referer: 'https://www.oref.org.il/',
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json; charset=utf-8',
};

const seenAlertIds = new Set();

/**
 * Fetches the current alert payload from Pikud HaOref.
 * The endpoint returns an empty body when there is no active alert,
 * so callers must handle a null result.
 */
async function fetchCurrentAlert() {
  const response = await fetch(ALERTS_URL, { headers: REQUEST_HEADERS });
  const raw = await response.text();

  if (!raw || !raw.trim()) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse oref response: ${err.message}`);
  }

  if (!payload || !payload.data || payload.data.length === 0) {
    return null;
  }

  const alertId = `${payload.id || ''}:${payload.data.join(',')}`;
  if (seenAlertIds.has(alertId)) {
    return null;
  }
  seenAlertIds.add(alertId);
  pruneSeenIds();

  return {
    areas: payload.data,
    category: payload.title,
    time: new Date(),
  };
}

function pruneSeenIds() {
  const MAX_TRACKED = 500;
  if (seenAlertIds.size > MAX_TRACKED) {
    const excess = seenAlertIds.size - MAX_TRACKED;
    const iterator = seenAlertIds.values();
    for (let i = 0; i < excess; i += 1) {
      seenAlertIds.delete(iterator.next().value);
    }
  }
}

module.exports = { fetchCurrentAlert };
