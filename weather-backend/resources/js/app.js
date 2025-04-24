import express from 'express';
import fetch from 'node-fetch'; // For making API calls
import cors from 'cors'; // If you're using ES modules (import/export)

const app = express();
const port = 8000;

// Use CORS middleware
app.use(cors());

app.get('/api/weather', async (req, res) => {
  const { city, unit } = req.query;
  const apiKey = 'cca7e48184d667dcb1b8ce072bf5e369';
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;

  try {
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();
    res.json(weatherData); // Send the weather data as JSON
  } catch (error) {
    res.status(500).send('Error fetching weather data');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
