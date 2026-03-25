import React, { useState } from "react";
import axios from "axios";

import bg from "./assets/backgrounds/weather-windyNight.svg";
import "./WeatherPage.css";

import TodayCard from "./components/TodayCard";
import SearchBar from "./components/SearchBar";
import HourlyForecast from "./components/HourlyForecast";
import Clock from "./components/Clock";
import menuIcon from "./assets/menu.svg";

function WeatherPage()
{
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [error, setError] = useState("");

  const apiKey = "7490f93900217326fe09b5658ba7c848";

  const handleSearch = async () =>
  {
    try
    {
      setError("");
      const currentResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&appid=${apiKey}`
      );

      setWeatherData(currentResponse.data);

      setHourlyData(forecastResponse.data.list.slice(0, 6));

      console.log(currentResponse.data);
      console.log(forecastResponse.data);
    }
    catch (err)
    {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div
      className="weather-page-background"
      style={{backgroundImage: `url(${bg})`}}
    >
      <div className="weather-page-container">

        {/* TOP BAR */}
        <div className="weather-top-bar">
          <div className="top-left">
            <div className="top-button-box">
              <img
                src={menuIcon}
                alt="menuIcon"
                className="weather-page-menu-button"
              />
            </div>
          </div>

          <div className="top-center">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              onSearch={handleSearch}
            />
          </div>

          <div className="top-right">
            <div className="top-time-box">
              <Clock />
            </div>
          </div>
        </div>

        {error && <p>{error}</p>}

        <div className="weather-layout">

          <div className="left-section">
            Left section
          </div>

          <div className="center-section">

            <div className="center-top-section">
              <TodayCard
                temperature={
                  weatherData ? Math.round(weatherData.main.temp) : 13
                }
                feelsLike={
                  weatherData ? Math.round(weatherData.main.feels_like) : 10
                }
              />
            </div>

            <div className="center-bottom-section">
              <HourlyForecast hourlyData={hourlyData} />
            </div>

          </div>

          <div className="right-section">
            <div className="right-top-section">Activities</div>
            <div className="right-bottom-section">Map</div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default WeatherPage;