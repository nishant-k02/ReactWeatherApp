import React, { useState } from 'react';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './App.css';

const App = () => {
  const [location, setLocation] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showRecords, setShowRecords] = useState(false);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [weatherDetails, setWeatherDetails] = useState(null);
  const [forecastDetails, setForecastDetails] = useState(null);

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { startDate, endDate } = dateRange[0];
  
    // Validate input
    if (!location.trim()) {
      alert('Please enter a valid location.');
      return;
    }
    if (isNaN(temperature) || temperature === '') {
      alert('Please enter a valid temperature.');
      return;
    }
  
    // Check if updating without changes
    if (selectedEntry) {
      const isSameLocation = selectedEntry.location === location;
      const isSameTemp = selectedEntry.temperature === parseFloat(temperature);
      const isSameStart = new Date(selectedEntry.start_date).getTime() === startDate.getTime();
      const isSameEnd = new Date(selectedEntry.end_date).getTime() === endDate.getTime();
      
      if (isSameLocation && isSameTemp && isSameStart && isSameEnd) {
        alert('No changes detected. Update canceled.');
        resetForm();
        return;
      }
    }
  
    try {
      if (selectedEntry) {
        await axios.put(`http://localhost:5000/api/temperature/${selectedEntry.id}`, {
          location,
          temperature,
          startDate,
          endDate,
        });
        alert('Temperature data updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/temperature', {
          location,
          temperature,
          startDate,
          endDate,
        });
        alert('Temperature data added successfully!');
      }
      resetForm();
      fetchWeatherHistory();
    } catch (error) {
      console.error('Error submitting temperature data:', error);
      alert('Failed to submit temperature data. Please try again.');
    }
  };
  
  

  const handleSearch = async () => {
    try {
      const weatherResponse = await axios.get(`http://localhost:5000/api/weather/${location}`);
      setWeatherDetails(weatherResponse.data);
      setTemperature(weatherResponse.data.main.temp.toString());
      setLocation(weatherResponse.data.name);
      setDateRange([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      }]);
      setSelectedEntry(null);
  
      const forecastResponse = await axios.get(`http://localhost:5000/api/forecast/${location}`);
      setForecastDetails(forecastResponse.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  
  
  const fetchWeatherByCoordinates = async (lat, lon) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`);
      setWeatherDetails(response.data);
      setTemperature(response.data.main.temp.toString());
      setLocation(response.data.name);
      setDateRange([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      }]);
      setSelectedEntry(null);
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
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };
  
  const handleFetchForecast = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/forecast/${location}`);
      setForecastDetails(response.data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  const getWeatherIconUrl = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const fetchWeatherHistory = async () => {
    if (!showRecords) {
      try {
        const response = await axios.get('http://localhost:5000/api/weather-history');
        setWeatherHistory(response.data);
      } catch (error) {
        console.error('Error fetching weather history:', error);
      }
    }
    setShowRecords(!showRecords);
  };
  

  // update record function
  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
    setLocation(entry.location);
    setTemperature(entry.temperature);
    setDateRange([
      {
        startDate: new Date(entry.start_date),
        endDate: new Date(entry.end_date),
        key: 'selection',
      },
    ]);
  };

  //reset update form
  const resetForm = () => {
    setSelectedEntry(null);
    setLocation('');
    setTemperature('');
    setDateRange([{
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }]);
  };
  

  //delete record function
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`http://localhost:5000/api/temperature/${id}`);
        fetchWeatherHistory(); // Refresh the weather history
        alert('Record deleted successfully');
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record. Please try again.');
      }
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
          <div className="button-group">
            <button
              type="submit"
              onClick={handleSubmit}
              className="submit-button"
              disabled={!location || !temperature}
            >
              {selectedEntry ? 'Update Temperature Data' : 'Add Temperature Data'}
            </button>

            {selectedEntry && (
              <button
                type="button"
                onClick={resetForm}
                className="cancel-button"
              >
                Cancel Update
              </button>
            )}
          </div>
      
          <DateRangePicker
            ranges={dateRange}
            onChange={handleDateChange}
            className="date-picker"
          />

          <button onClick={fetchWeatherHistory} className="history-button">
            {showRecords ? 'Hide Stored Weather History' : 'View Stored Weather History'}
          </button>

        {weatherHistory.length > 0 && showRecords && (
          <div className="weather-history">
            <h3>Stored Weather History</h3>
            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Temperature</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Update Records</th>
                  <th>Delete Records</th>
                </tr>
              </thead>
              <tbody>
              {weatherHistory.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.location}</td>
                  <td>{entry.temperature}°C</td>
                  <td>{new Date(entry.start_date).toLocaleDateString()}</td>
                  <td>{new Date(entry.end_date).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleSelectEntry(entry)} className="update-button">Update</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(entry.id)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
       )}
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
            Current Location 
          </button>
          <button
            onClick={handleFetchForecast}
            className="forecast-button"
            disabled={!location}
          >
            5-Day Forecast
          </button>
        </div>

          {weatherDetails && (
            <div className="weather-card">
              <div className="weather-location">
                {weatherDetails.name}, {weatherDetails.sys.country}
              </div>
              <div className="weather-icon-description">
                <img 
                  src={getWeatherIconUrl(weatherDetails.weather[0].icon)} 
                  alt={weatherDetails.weather[0].description}
                  className="weather-icon"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                <span className="weather-description">
                  {weatherDetails.weather[0].description}
                </span>
              </div>
              <div className="weather-temperature">
                Temperature: {weatherDetails.main.temp}°C
              </div>
              <div className="weather-humidity">
                Humidity: {weatherDetails.main.humidity}%
              </div>
              <div className="weather-wind-speed">
                Wind Speed: {weatherDetails.wind.speed} m/s
              </div>
            </div>
        )}

        {forecastDetails && (
          <div className="forecast-container">
            <h3 className="forecast-title">5-Day Forecast for {weatherDetails.name}</h3>
            <div className="forecast-cards">
              {forecastDetails.map((forecast, index) => (
                <div key={index} className="forecast-card">
                  <div className="forecast-date">
                    {new Date(forecast.dt_txt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="forecast-icon-description">
                    <img 
                      src={getWeatherIconUrl(forecast.weather[0].icon)} 
                      alt={forecast.weather[0].description}
                      className="forecast-icon"
                    />
                    <span className="forecast-description">
                      {forecast.weather[0].description}
                    </span>
                  </div>
                  <div className="forecast-temperature">
                    Temperature: {Math.round(forecast.main.temp)}°C
                  </div>
                  <div className="forecast-humidity">
                    Humidity: {forecast.main.humidity}%
                  </div>
                  <div className="forecast-wind-speed">
                    Wind: {forecast.wind.speed} m/s
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default App;
