const express = require('express');
const path = require('path');
const { getActiveAreas } = require('./services/orefService');
const areaCoordinates = require('./data/areaCoordinates');

function createServer() {
  const app = express();
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/api/active-alerts', (req, res) => {
    const active = getActiveAreas();
    const areas = [];
    const unmapped = [];

    for (const area of active) {
      const coords = areaCoordinates[area];
      if (coords) {
        areas.push({ name: area, lat: coords.lat, lng: coords.lng });
      } else {
        unmapped.push(area);
      }
    }

    res.json({ areas, unmapped, updatedAt: new Date().toISOString() });
  });

  return app;
}

module.exports = { createServer };
