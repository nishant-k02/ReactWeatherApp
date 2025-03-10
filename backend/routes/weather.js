const express = require("express");
const db = require("../config/db"); // Make sure this is correctly imported
const router = express.Router();

router.post("/save", async (req, res) => {
    const { location, temperature, description, humidity } = req.body;

    try {
        const sql = "INSERT INTO weather_data (location, temperature, description, humidity) VALUES (?, ?, ?, ?)";
        await db.promise().query(sql, [location, temperature, description, humidity]);
        res.json({ message: "Weather data saved!" });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Failed to save weather data" });
    }
});
router.get("/history", async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM weather_data ORDER BY date_time DESC");
        res.json(rows);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Failed to fetch weather history" });
    }
});
app.put("/weather/update/:id", (req, res) => {
    const { id } = req.params;
    const { temperature, description } = req.body;
  
    const query = `UPDATE weather_history SET temperature = ?, description = ? WHERE id = ?`;
    db.query(query, [temperature, description, id], (err, result) => {
      if (err) {
        console.error("Error updating record:", err);
        res.status(500).json({ error: "Failed to update record" });
      } else {
        res.json({ message: "Record updated successfully" });
      }
    });
  });
  app.delete("/weather/delete/:id", (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM weather_history WHERE id = ?`;
  
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error deleting record:", err);
        res.status(500).json({ error: "Failed to delete record" });
      } else {
        res.json({ message: "Record deleted successfully" });
      }
    });
  });
router.get("/", async (req, res) => {
    const { location } = req.query;

    if (!location) {
        return res.status(400).json({ error: "Location is required" });
    }

    try {
        const apiKey = "ba491a187a72397f5ee8e5f3253ff2e8"; // Replace with actual API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod !== 200) {
            return res.status(404).json({ error: "Location not found" });
        }

        res.json(data);
    } catch (error) {
        console.error("Weather API Error:", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

module.exports = router;