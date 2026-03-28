import React, { useState } from "react";
import bg from "./assets/PartlyCloudy.png"; 
import "./TodayWeather.css";
import backBtn from './assets/BackBtn.png';
import searchIcon from './assets/search.svg';
import cloudyIcon from './assets/weather-icons/clouds.svg';
import HourlyV2 from "./components/HourlyV2";

function TodayWeather() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="dashboard-container" style={{ backgroundImage: `url(${bg})` }}>
      
      {/* TOP*/}
      <nav className="top-nav">
        <button className="back-btn">
          <img src={backBtn} alt="Back" />
        </button>

        <div className="toggle-pill toggle-shift">
          <div className="toggle-opt active">°C</div>
          <div className="toggle-opt">°F</div>
        </div>

        <div className="toggle-pill">
          <div className="toggle-opt active">mi</div>
          <div className="toggle-opt">km</div>
        </div>

        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search Location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src={searchIcon} alt="Search" />
        </div>
      </nav>

      {/*MIDDLE stuff*/}
      <main className="main-content-area">
        
        {/* Current Weather */}
        <div className="current-weather-col">
          <h2 className="location-header">location_current</h2>
          
          <div className="weather-primary-row">
            <img src={cloudyIcon} alt="Cloudy" className="main-weather-icon" />
            
            <div className="temperature-stack">
              <h1 className="huge-temp">temp_current</h1>
              <div className="weather-desc">
                <p>Feels like: feels_like_current</p>
                <p>weather_current</p>
                <p>rain_current</p>
              </div>
            </div>
          </div>
        </div>

        {/*Metrics*/}
        <div className="metrics-card">
          <div className="metrics-header">
            <h2>Sport</h2>
            <h2>score_current/10</h2>
          </div>
          <p>Temperature ... temp_high/temp_low</p>
          <p>Wind speeds ... metric_wind</p>
          <p>Humidity ... metric_humidity</p>
          <p>Chance of rain ... metric_rain</p>
          <p>Visibility ... metric_visibility</p>
        </div>

      </main>

      {/*bottom part */}
      <div className="bottom-forecast-area">
        <HourlyV2 />
      </div>

    </div>
  );
}

export default TodayWeather;