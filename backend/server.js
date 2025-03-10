const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors'); // Import CORS

const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'OPTIONS'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  preflightContinue: false, // Pass the CORS preflight response to the next handler
  optionsSuccessStatus: 204 // Use 204 for successful OPTIONS requests
}));

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

// Fetch Weather Data from External API
app.get('/api/weather/:location', async (req, res) => {
  const location = req.params.location;
  const API_KEY = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const weatherData = response.data;
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Fetch 5-Day Weather Forecast
app.get('/api/weather/forecast/:location', async (req, res) => {
  const location = req.params.location;
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&cnt=5&appid=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const forecastData = response.data;
    res.json(forecastData);
  } catch (error) {
    console.error('Error fetching forecast:', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// Insert Temperature Data with Date Range
app.post('/api/temperature', (req, res) => {
  const { location, temperature, startDate, endDate } = req.body;

  const query = 'INSERT INTO temperature_data (location, temperature, start_date, end_date) VALUES (?, ?, ?, ?)';
  db.query(query, [location, temperature, new Date(startDate), new Date(endDate)], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Failed to insert data' });
    } else {
      res.json({ message: 'Data inserted successfully' });
    }
  });
});

// Handle Preflight Requests
app.options('*', cors()); // Enable preflight for all routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
