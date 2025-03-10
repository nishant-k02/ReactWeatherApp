const express = require("express");
const { getWeather, saveWeather } = require("../controllers/weatherController");
const router = express.Router();

router.get("/:location", getWeather);
router.post("/", saveWeather);

module.exports = router;
