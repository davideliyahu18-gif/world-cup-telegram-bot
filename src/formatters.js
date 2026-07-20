const config = require('./config');

function header() {
  return `${config.brandEmoji} *${escapeMd(config.brandName)}*`;
}

function escapeMd(text) {
  return String(text).replace(/([_*[\]()~`>#+=|{}.!-])/g, '\\$1');
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jerusalem',
  });
}

function formatAlert({ areas, category, time }) {
  const areaList = Array.isArray(areas) ? areas.join(', ') : areas;
  return [
    header(),
    '🚨 *התרעה בפועל*',
    '━━━━━━━━━━━━━━',
    `📍 *אזור:* ${escapeMd(areaList || 'לא צוין')}`,
    category ? `⚠️ *סוג:* ${escapeMd(category)}` : null,
    `🕐 *שעה:* ${escapeMd(formatTime(time))}`,
    '━━━━━━━━━━━━━━',
    '_מידע לא רשמי \\- מקור: פיקוד העורף_',
    '_להנחיות רשמיות בקרו באתר פיקוד העורף_',
  ]
    .filter(Boolean)
    .join('\n');
}

function formatNews({ title, summary, source, link, time }) {
  return [
    header(),
    '📰 *עדכון חדשות*',
    '',
    `*${escapeMd(title)}*`,
    summary ? escapeMd(summary) : null,
    '',
    `🔗 מקור: ${escapeMd(source)} \\| ${escapeMd(formatTime(time))}`,
    link ? escapeMd(link) : null,
  ]
    .filter(Boolean)
    .join('\n');
}

module.exports = { formatAlert, formatNews, escapeMd, formatTime };
