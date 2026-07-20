const fetch = require('node-fetch');

const ALERTS_URL = 'https://www.oref.org.il/WarningMessages/alert/alerts.json';
// How long an area stays "active" on the live map after its last reported alert.
const ACTIVE_AREA_TTL_MS = 3 * 60 * 1000;

const REQUEST_HEADERS = {
  Referer: 'https://www.oref.org.il/',
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json; charset=utf-8',
};

const seenAlertIds = new Set();
const activeAreaExpiry = new Map();

/**
 * Fetches the current alert payload from Pikud HaOref and returns it only
 * the first time a given alert is seen (for the Telegram notification).
 * The endpoint returns an empty body when there is no active alert, so
 * callers must handle a null result.
 */
async function fetchCurrentAlert() {
  const payload = await fetchAlertPayload();
  if (!payload) {
    return null;
  }

  markAreasActive(payload.data);

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

/** Returns area names with a still-unexpired alert, for the live map. */
function getActiveAreas() {
  const now = Date.now();
  const active = [];
  for (const [area, expiry] of activeAreaExpiry.entries()) {
    if (expiry > now) {
      active.push(area);
    } else {
      activeAreaExpiry.delete(area);
    }
  }
  return active;
}

async function fetchAlertPayload() {
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

  return payload;
}

function markAreasActive(areas) {
  const expiry = Date.now() + ACTIVE_AREA_TTL_MS;
  for (const area of areas) {
    activeAreaExpiry.set(area, expiry);
  }
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

module.exports = { fetchCurrentAlert, getActiveAreas };
