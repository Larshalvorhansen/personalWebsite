// server.js

const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

// Replace with your actual API key
const apiKey = 'YOUR_API_KEY';

app.get('/bus-times', async (req, res) => {
  const busStopCoordinates = [60.4720, 5.3244]; // Example coordinates

  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${busStopCoordinates[0]},${busStopCoordinates[1]}&destination=${busStopCoordinates[0]},${busStopCoordinates[1]}&mode=transit&key=${apiKey}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bus times' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
