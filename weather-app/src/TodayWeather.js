import { useState, useEffect } from "react";
import bg from "./assets/PartlyCloudy.png";
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
import { fetchWeatherByCity, fetchWeatherByCoords } from "./services/weatherApi";
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
  const [tempUnit, setTempUnit] = useState("C");
  const [distUnit, setDistUnit] = useState("mi");

  const toF = (c) => Math.round(c * 9 / 5 + 32);
  const toKm = (mi) => Math.round(mi * 1.60934);
  const toKmh = (mph) => Math.round(mph * 1.60934);

  const fmtTemp = (c) => c == null ? "—" : tempUnit === "C" ? `${c}°C` : `${toF(c)}°F`;
  const fmtWind = (mph) => mph == null ? "—" : distUnit === "mi" ? `${mph}mph` : `${toKmh(mph)}km/h`;
  const fmtVis = (mi) => mi == null ? "—" : distUnit === "mi" ? `${mi}mi` : `${toKm(mi)}km`;

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
        () => {} // permission denied — user can search manually
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

  return (
    <div className="dashboard-container" style={{ backgroundImage: `url(${bg})` }}>
      <div className="dashboard-inner">

      {/* TOP */}
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
          <div className={`toggle-opt ${tempUnit === "C" ? "active" : ""}`} onClick={() => setTempUnit("C")}>°C</div>
          <div className={`toggle-opt ${tempUnit === "F" ? "active" : ""}`} onClick={() => setTempUnit("F")}>°F</div>
        </div>

        <div className="toggle-pill">
          <div className={`toggle-opt ${distUnit === "mi" ? "active" : ""}`} onClick={() => setDistUnit("mi")}>mi</div>
          <div className={`toggle-opt ${distUnit === "km" ? "active" : ""}`} onClick={() => setDistUnit("km")}>km</div>
        </div>

        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </nav>

      {error && (
        <div style={{ color: "red", padding: "4px 16px", fontFamily: "Rubik" }}>
          {error}
        </div>
      )}

      {/* MIDDLE */}
      <main className="main-content-area">

        {/* Current Weather */}
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

        {/* Metrics */}
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

      {/* BOTTOM */}
      <div className="bottom-forecast-area">
        <HourlyV2 hourly={w ? w.hourly : []} />
      </div>

      </div>
    </div>
  );
}

export default TodayWeather;
