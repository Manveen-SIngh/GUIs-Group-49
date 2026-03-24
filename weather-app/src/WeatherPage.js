import React, { useState } from "react";
import bg from "./assets/PartlyCloudy.png";
import "./WeatherPage.css";
import TodayCard from "./components/TodayCard";
import SearchBar from "./components/SearchBar";
import HourlyForecast from "./components/HourlyForecast";

function WeatherPage()
{
  const [query, setQuery] = useState("");

  const handleSearch = () =>
  {
    console.log("Searching for:", query);
  };

  return (
    <div
      className="weather-page-background"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="weather-page-container">
        <div className="weather-top-bar">
          <div className="top-left">
            <div className="top-button-box">
              Menu
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
              11:34
            </div>
          </div>
        </div>

        <div className="weather-layout">
          <div className="left-section">
            Left section
          </div>

          <div className="center-section">
            <div className="center-top-section">
              <TodayCard
                temperature={13}
                feelsLike={10}
                unit="°C"
              />
            </div>

            <div className="center-bottom-section">
              <HourlyForecast />
            </div>
          </div>

          <div className="right-section">
            <div className="right-top-section">
              Activities
            </div>

            <div className="right-bottom-section">
              Map
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;