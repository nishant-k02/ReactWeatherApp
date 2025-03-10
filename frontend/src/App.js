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
              className="input-field"
            />
            <input
              type="number"
              placeholder="Enter temperature..."
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <button type="submit" onClick={handleSubmit} className="submit-button">
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
              className="input-field"
            />
            <button onClick={handleSearch} className="search-button">
              Search Weather
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
