import React, { useState } from 'react';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './App.css';

const App = () => {
  const [location, setLocation] = useState('');
  const [temperature, setTemperature] = useState('');
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [weatherDetails, setWeatherDetails] = useState(null);

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { startDate, endDate } = dateRange[0];
    try {
      await axios.post('http://localhost:5000/api/temperature', {
        location,
        temperature,
        startDate,
        endDate,
      });
      alert('Temperature data added successfully!');
      setLocation('');
      setTemperature('');
    } catch (error) {
      console.error('Error adding temperature data:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/weather/${location}`);
      setWeatherDetails(response.data);
      setTemperature(response.data.main.temp);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchWeatherByCoordinates = async (lat, lon) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`);
      setWeatherDetails(response.data);
      setTemperature(response.data.main.temp);
      setLocation(response.data.name); // Update the location field in the left section
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
    }
  };

  const handleGetCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude);
          setLocation(''); // Clear the location field in the right section
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Weather App</h1>
      <div className="content-container">
        <div className="left-section">
          <h2 className="input-title">Add Temperature Data</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              title="Location is required"
              className="input-field"
            />
            <input
              type="number"
              placeholder="Enter temperature..."
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              required
              title="Temperature is required"
              className="input-field"
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="submit-button"
            disabled={!location || !temperature}
          >
            Add Temperature Data
          </button>
          <DateRangePicker
            ranges={dateRange}
            onChange={handleDateChange}
            className="date-picker"
          />
        </div>
        <div className="right-section">
          <h2 className="input-title">Search Weather</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              title="Location is required"
              className="input-field"
            />
            <button
              onClick={handleSearch}
              className="search-button"
              disabled={!location}
            >
              Search Weather
            </button>
            <button
              onClick={handleGetCurrentLocationWeather}
              className="current-location-button"
            >
              Get Current Location Weather
            </button>
          </div>

          {weatherDetails && (
            <div className="weather-card">
              <div className="weather-location">
                {weatherDetails.name}, {weatherDetails.sys.country}
              </div>
              <div className="weather-temperature">
                Temperature: {weatherDetails.main.temp}°C
              </div>
              <div className="weather-description">
                Weather: {weatherDetails.weather[0].description}
              </div>
              <div className="weather-humidity">
                Humidity: {weatherDetails.main.humidity}%
              </div>
              <div className="weather-wind-speed">
                Wind Speed: {weatherDetails.wind.speed} m/s
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
