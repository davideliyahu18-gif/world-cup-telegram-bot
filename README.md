# דוד - מערכת שוע"ל אזרחי 🛡️

בוט טלגרם שמרליי לצ'אט/ערוץ:
- התרעות בזמן אמת מ-API הציבורי של פיקוד העורף
- עדכוני חדשות מפידי RSS ישראליים (Ynet, וואלה, כאן חדשות)

⚠️ **הבהרה**: זהו כלי קהילתי לא רשמי שמרליי מידע ציבורי. לכל התרעה יש תיוג "מידע לא רשמי" עם הפניה למקור הרשמי. אין להסתמך עליו כמקור בלעדי להנחיות חירום.

## התקנה

```bash
npm install
cp .env.example .env
```

מלאו ב-`.env`:
- `BOT_TOKEN` - טוקן מ-[@BotFather](https://t.me/BotFather)
- `CHAT_ID` - ה-ID של הצ'אט/ערוץ שהבוט ישלח אליו (הריצו את הבוט, שלחו `/start` בצ'אט היעד, וה-ID יופיע בתגובה)

## הרצה

```bash
npm start
```

## מבנה הפרויקט

```
src/
  config.js              # הגדרות, מיתוג, רשימת פידי חדשות
  formatters.js          # תבניות ההודעות (סגנון "התרעת חירום")
  bot.js                 # מופע ה-Telegraf, פקודות /start ו-/status
  index.js               # נקודת הכניסה, לולאות ה-polling
  services/
    orefService.js       # שליפת התרעות מ-API של פיקוד העורף
    newsService.js        # שליפת עדכונים מפידי RSS
```

## התאמה אישית

- פידי חדשות נוספים: `src/config.js` -> `newsFeeds`
- תדירות בדיקה: `OREF_POLL_INTERVAL_MS` ו-`NEWS_POLL_INTERVAL_MS` בקובץ `.env`
- עיצוב ההודעות: `src/formatters.js`
