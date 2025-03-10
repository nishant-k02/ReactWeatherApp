import React, { useState } from 'react';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

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
      console.log('Current Weather Data:', response.data);
      setWeatherDetails(response.data);
      setTemperature(response.data.main.temp); // Set temperature field with fetched data
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Add Temperature Data</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Enter temperature..."
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          required
        />
        <DateRangePicker
          ranges={dateRange}
          onChange={handleDateChange}
        />
        <button type="submit">Add Temperature Data</button>
      </form>

      <div>
        <h2>Search Current Weather</h2>
        <input
          type="text"
          placeholder="Enter location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={handleSearch}>Search Weather</button>
      </div>

      {weatherDetails && (
        <div>
          <h3>Weather Details for {weatherDetails.name}, {weatherDetails.sys.country}:</h3>
          <p><strong>Temperature:</strong> {weatherDetails.main.temp}°C</p>
          <p><strong>Weather:</strong> {weatherDetails.weather[0].description}</p>
          <p><strong>Humidity:</strong> {weatherDetails.main.humidity}%</p>
          <p><strong>Wind Speed:</strong> {weatherDetails.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default App;
