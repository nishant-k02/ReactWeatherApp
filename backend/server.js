// server.js
const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'weather_db',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});

// Fetch Weather Data by City Name
app.get('/api/weather/:location', async (req, res) => {
  const location = req.params.location;
  const API_KEY = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Fetch Weather Data by Latitude and Longitude
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;
  const API_KEY = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Insert Temperature Data with Date Range
app.post('/api/temperature', (req, res) => {
  const { location, temperature, startDate, endDate } = req.body;

  const query = 'INSERT INTO temperature_data (location, temperature, start_date, end_date) VALUES (?, ?, ?, ?)';
  db.query(query, [location, temperature, new Date(startDate), new Date(endDate)], (err) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Failed to insert data' });
    } else {
      res.json({ message: 'Data inserted successfully' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
