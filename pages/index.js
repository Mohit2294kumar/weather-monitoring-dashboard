// pages/index.js

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Image from "next/image";

const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || d351585125caba7dbff3933cc6b4cb83;

const Weather = () => {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState({
    city: "Delhi, IN",
    temperature: "",
    description: "",
    icon: "",
  });

  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===============================
  // Fetch Forecast (Hourly + Daily)
  // ===============================
  const fetchForecast = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      const data = response.data;

      // Next 5 hours
      const hourly = data.list.slice(0, 5).map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        tempMax: item.main.temp_max,
        tempMin: item.main.temp_min,
        description: item.weather[0].description,
      }));

      setHourlyForecast(hourly);

      // Next 4 days (8 records per day)
      const daily = [];
      for (let i = 8; i < data.list.length; i += 8) {
        daily.push({
          date: new Date(data.list[i].dt * 1000).toDateString(),
          tempMax: data.list[i].main.temp_max,
          tempMin: data.list[i].main.temp_min,
          description: data.list[i].weather[0].description,
        });
      }

      setDailyForecast(daily.slice(0, 4));
    } catch (err) {
      setError("Failed to load forecast data.");
    }
  };

  // ===============================
  // Fetch Current Weather
  // ===============================
  const fetchWeather = useCallback(async (url) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(url);
      const data = response.data;

      setCurrentWeather({
        city: `${data.name}, ${data.sys.country}`,
        temperature: `${data.main.temp} °C`,
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
      });

      fetchForecast(data.coord.lat, data.coord.lon);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("City not found. Please check spelling.");
      } else if (err.response?.status === 401) {
        setError("Invalid API key.");
      } else {
        setError("Failed to load weather data.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ===============================
  // Search City
  // ===============================
  const searchByCity = () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetchWeather(url);
    setCity("");
  };

  // ===============================
  // Load on First Render
  // ===============================
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
          fetchWeather(url);
        },
        () => {
          const fallback = `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${apiKey}&units=metric`;
          fetchWeather(fallback);
        }
      );
    } else {
      const fallback = `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${apiKey}&units=metric`;
      fetchWeather(fallback);
    }
  }, [fetchWeather]);

  return (
    <div>
      <div className="header">
        <h1>WEATHER Monitoring Dashboard</h1>
        <div>
          <input
            type="text"
            id="input"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchByCity()}
          />
          <button id="search" onClick={searchByCity}>
            Search
          </button>
        </div>
      </div>

      <main>
        <div className="weather">
          <h2 id="city">{currentWeather.city}</h2>

          <div className="temp-box">
            {currentWeather.icon && (
              <Image
                id="img"
                src={currentWeather.icon}
                alt="Weather icon"
                width={80}
                height={80}
              />
            )}
            <p id="temperature">{currentWeather.temperature}</p>
          </div>

          <span id="clouds">{currentWeather.description}</span>

          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
        </div>

        <div className="divider1"></div>

        <div className="forecast">
          <p className="cast-header">Upcoming forecast</p>
          <div className="templist">
            {hourlyForecast.map((hour, index) => (
              <div key={index} className="next">
                <div>
                  <p className="time">{hour.time}</p>
                  <p>
                    {hour.tempMax} °C / {hour.tempMin} °C
                  </p>
                </div>
                <p className="desc">{hour.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="divider2"></div>

      <div className="forecstD">
        <p className="cast-header">Next 4 days forecast</p>
        <div className="weekF">
          {dailyForecast.map((day, index) => (
            <div key={index}>
              <p className="date">{day.date}</p>
              <p>
                {day.tempMax} °C / {day.tempMin} °C
              </p>
              <p className="desc">{day.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
