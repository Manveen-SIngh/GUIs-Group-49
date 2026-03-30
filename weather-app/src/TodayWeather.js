import { useState, useEffect } from "react";
import { fetchWeatherByCity, fetchWeatherByCoords, getBackgroundImage } from "./services/weatherApi";
import fallbackBg from "./assets/PartlyCloudy.png"; 

import "./TodayWeather.css";
import menuIcon from './assets/menu.svg';
import { useSidebar } from "./Sidebar";
import sunnyIcon      from './assets/weather-icons/Sunny.svg';
import cloudsIcon     from './assets/weather-icons/clouds.svg';
import rainyIcon      from './assets/weather-icons/rainy.svg';
import stormyIcon     from './assets/weather-icons/stormy.svg';
import windyIcon      from './assets/weather-icons/windy.svg';
import partlyIcon     from './assets/weather-icons/sun-clouds.svg';
import HourlyV2 from "./components/HourlyV2";
import SearchBar from "./components/SearchBar";
import precipIcon from './assets/precipitation.svg';
import windIcon   from './assets/weather-icons/windy.svg';
import uvIcon     from './assets/UV.png';
import compassIcon from './assets/Compass.png';

const getConditionIcon = (condition) => {
  if (condition === "Clear")                           return sunnyIcon;
  if (condition === "Clouds")                          return cloudsIcon;
  if (condition === "Rain" || condition === "Drizzle") return rainyIcon;
  if (condition === "Thunderstorm")                    return stormyIcon;
  if (condition === "Wind")                            return windyIcon;
  return partlyIcon;
};

function TodayWeather() {
  const { open } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  // Initialize state from localStorage to keep UI in sync with Settings
  const [tempUnit, setTempUnit] = useState(() => {
    const saved = localStorage.getItem("unitSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.Temperature === "Fahrenheit (F)" ? "F" : "C";
    }
    return "C";
  });

  const [distUnit, setDistUnit] = useState(() => {
    const saved = localStorage.getItem("unitSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      return (parsed.Distance && parsed.Distance.includes("mi")) ? "mi" : "km";
    }
    return "mi";
  });

  // Toggles save to localStorage and trigger a re-fetch so the API does the math
  const handleTempToggle = (unit) => {
    setTempUnit(unit);
    const saved = localStorage.getItem("unitSettings");
    const parsed = saved ? JSON.parse(saved) : {};
    parsed.Temperature = unit === "F" ? "Fahrenheit (F)" : "Celsius (C)";
    localStorage.setItem("unitSettings", JSON.stringify(parsed));
    if (weather) loadWeather(weather.locationName);
  };

  const handleDistToggle = (unit) => {
    setDistUnit(unit);
    const saved = localStorage.getItem("unitSettings");
    const parsed = saved ? JSON.parse(saved) : {};
    // Synchronize both Distance and Wind Speed settings
    parsed.Distance = unit === "mi" ? "Miles (mi)" : "Kilometers (km)";
    parsed["Wind Speed"] = unit === "mi" ? "Miles per hour (mph)" : "Kilometers per hour (km/h)";
    localStorage.setItem("unitSettings", JSON.stringify(parsed));
    if (weather) loadWeather(weather.locationName);
  };

  // Helper functions: API provides the number, we provide the label
  const fmtTemp = (val) => val == null ? "—" : `${Math.round(val)}°${tempUnit}`;
  const fmtWind = (val) => val == null ? "—" : `${Math.round(val)}${distUnit === "mi" ? "mph" : "km/h"}`;
  const fmtVis = (val) => val == null ? "—" : `${val}${distUnit}`;

  const loadWeather = async (city) => {
    try {
      setError("");
      const data = await fetchWeatherByCity(city);
      setWeather(data);
      localStorage.setItem("lastCity", city);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("lastCity");
    if (saved) {
      loadWeather(saved);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const data = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
            setWeather(data);
            localStorage.setItem("lastCity", data.locationName);
          } catch (err) {
            setError(err.message);
          }
        },
        () => {} 
      );
    }
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) loadWeather(searchQuery.trim());
  };

  const w = weather;
  const cur = w ? w.current : null;
  const tod = w ? w.today : null;
  const scores = w ? w.scores : null;
  const avgScore = scores
    ? Math.round((scores.cycling + scores.hiking + scores.running + scores.camping) / 4)
    : null;

  let currentBg = fallbackBg;
  if (cur) {
    const isNight = cur.nowHour < cur.sunriseHour || cur.nowHour >= cur.sunsetHour;
    currentBg = getBackgroundImage(cur.condition, isNight);
  }

  return (
    <div 
        className="dashboard-container" 
        style={{ 
            backgroundImage: `url(${currentBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            transition: "background-image 0.5s ease-in-out"
        }}
    >
      <div className="dashboard-inner">
      <nav className="top-nav">
        <div className="top-button-box">
          <img
            src={menuIcon}
            alt="menuIcon"
            className="weather-page-menu-button"
            onClick={open}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div className="toggle-pill toggle-shift">
          <div className={`toggle-opt ${tempUnit === "C" ? "active" : ""}`} onClick={() => handleTempToggle("C")}>°C</div>
          <div className={`toggle-opt ${tempUnit === "F" ? "active" : ""}`} onClick={() => handleTempToggle("F")}>°F</div>
        </div>

        <div className="toggle-pill">
          <div className={`toggle-opt ${distUnit === "mi" ? "active" : ""}`} onClick={() => handleDistToggle("mi")}>mi</div>
          <div className={`toggle-opt ${distUnit === "km" ? "active" : ""}`} onClick={() => handleDistToggle("km")}>km</div>
        </div>

        <SearchBar query={searchQuery} onQueryChange={setSearchQuery} onSearch={handleSearch} />
      </nav>

      {error && <div style={{ color: "red", padding: "4px 16px", fontFamily: "Rubik" }}>{error}</div>}

      <main className="main-content-area">
        <div className="current-weather-col">
          <h2 className="location-header">{w ? w.locationName : "—"}</h2>
          <div className="weather-primary-row">
            <img src={getConditionIcon(cur?.condition)} alt={cur?.condition || "Weather"} className="main-weather-icon" />
            <div className="temperature-stack">
              <h1 className="huge-temp">{cur ? fmtTemp(cur.temp) : "—"}</h1>
              <div className="weather-desc">
                <p>Feels like: {cur ? fmtTemp(cur.feelsLike) : "—"}</p>
                <p>{cur ? cur.condition : "—"}</p>
                <p>Rain: {cur ? `${cur.pop}%` : "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="metrics-card">
          <div className="metrics-header">
            <h2>Overall</h2>
            <h2>{avgScore !== null ? `${avgScore}/10` : "—"}</h2>
          </div>
          <div className="metric-row">
            <span className="metric-icon">🌡️</span>
            <span className="metric-label">Temperature</span>
            <span className="metric-value">{tod ? `${fmtTemp(tod.tempHigh)} / ${fmtTemp(tod.tempLow)}` : "—"}</span>
          </div>
          <div className="metric-row">
            <img src={windIcon} alt="Wind" className="metric-icon-img" />
            <span className="metric-label">Wind</span>
            <span className="metric-value">{tod ? fmtWind(tod.windSpeed) : "—"}</span>
          </div>
          <div className="metric-row">
            <span className="metric-icon">💧</span>
            <span className="metric-label">Humidity</span>
            <span className="metric-value">{tod ? `${tod.humidity}%` : "—"}</span>
          </div>
          <div className="metric-row">
            <img src={precipIcon} alt="Rain" className="metric-icon-img" />
            <span className="metric-label">Rain</span>
            <span className="metric-value">{tod ? `${tod.pop}%` : "—"}</span>
          </div>
          <div className="metric-row">
            <img src={uvIcon} alt="UV" className="metric-icon-img" />
            <span className="metric-label">UV Index</span>
            <span className="metric-value">{cur ? (cur.uvi ?? "—") : "—"}</span>
          </div>
          <div className="metric-row">
            <img src={compassIcon} alt="Visibility" className="metric-icon-img" />
            <span className="metric-label">Visibility</span>
            <span className="metric-value">{cur ? fmtVis(cur.visibility) : "—"}</span>
          </div>
        </div>
      </main>

      <div className="bottom-forecast-area">
        <HourlyV2 hourly={w ? w.hourly : []} tempUnit={tempUnit} distUnit={distUnit} />
      </div>
      </div>
    </div>
  );
}

export default TodayWeather;