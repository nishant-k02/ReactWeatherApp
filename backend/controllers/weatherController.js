const axios = require("axios");
const db = require("../config/db");

const getWeather = async (req, res) => {
    try {
        const { location } = req.params;
        const apiKey = process.env.WEATHER_API_KEY;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching weather data" });
    }
};

const saveWeather = (req, res) => {
    const { location, date, temperature, description } = req.body;

    const sql = "INSERT INTO weather_data (location, date, temperature, description) VALUES (?, ?, ?, ?)";
    db.query(sql, [location, date, temperature, description], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Weather data saved", id: result.insertId });
    });
};

module.exports = { getWeather, saveWeather };
