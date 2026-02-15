Create a Weather Monitoring Dashboard with Next.js

This project involves building a Weather Monitoring Dashboard using NextJS. The dashboard allows users to check the current weather and forecast for a specific city, as well as an hourly forecast for the next few hours and a daily forecast for the next four days.

Output Preview: Let us have a look at how the final output will look like.

![alt text](image.png)

Prerequisites:
NPM & NodeJS
ReactJS
NextJS
JavaScript
CSS
Approach to Create Weather Monitoring Dashboard with NextJS:
Fetch current weather data using the OpenWeatherMap API based on geolocation or city search.
Display current weather information including temperature, city name, and cloud conditions.
Fetch hourly and daily forecasts for the specified location.
Render hourly forecast data dynamically.
Render daily forecast data dynamically.
Steps to Create the NextJS App:
Step 1: Set up a NextJS project and navigate to that project folder

npx create-next-app weather-monitoring-dashboard
Step 2: Navigate to the root directory of your project.

cd weather-monitoring-dashboard
Step 3: Install necessary dependencies (axios for making HTTP requests).

npm install axios

If an app folder exist in your project, delete it.
Create index.js and _app.js inside the pages folder using following code.
Generate your own api from openweathermap and replace it with index.js apikey.
create globals.css with the code given below inside the styles folder.