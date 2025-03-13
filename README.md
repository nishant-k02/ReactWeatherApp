## Weather App
This Weather App allows users to search for current weather conditions, view forecasts, and manage temperature data for various locations.

## Features
1. Search for current weather by location

2. Get weather for current location

3. View 5-day weather forecast

4. Add, update, and delete temperature records

5. View stored weather history

## How to Run
Clone the repository to your local machine.

Navigate to the project directory in your terminal.

## Install dependencies:


npm install
Create a .env file in the root directory and add your OpenWeatherMap API key:

WEATHER_API_KEY=your_api_key_here
Start the backend server:

node server.js
In a new terminal window, start the React app:

npm start
Open your browser and navigate to http://localhost:3000 to use the app.

## What We Did
Created a React frontend with components for weather search, display, and data management.

1. Implemented an Express backend to handle API requests and database operations.

2. Integrated the OpenWeatherMap API for current weather and forecast data.

3. Used MySQL to store and manage temperature records.

4. Implemented CRUD operations for temperature records.

5. Added responsive design for better usability across devices.

6. Implemented error handling and input validation.

7. Added a date range picker for selecting date ranges when adding or updating records.

8. Created a toggle feature to show/hide stored weather history.

9. Implemented a feature to use the user's current location for weather data.

## Technologies Used
Frontend: React, Axios, react-date-range

Backend: Node.js, Express

Database: MySQL

API: OpenWeatherMap
