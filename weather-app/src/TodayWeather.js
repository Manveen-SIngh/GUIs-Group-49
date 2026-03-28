import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "./assets/PartlyCloudy.png";
import "./TodayWeather.css";
import backBtn from './assets/BackBtn.png';
import cloudyIcon from './assets/weather-icons/clouds.svg';
import HourlyV2 from "./components/HourlyV2";
import { fetchWeatherByCity, fetchWeatherByCoords } from "./services/weatherApi";
import SearchBar from "./components/SearchBar";

function TodayWeather() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

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

      {/* TOP */}
      <nav className="top-nav">
        <button className="back-btn" onClick={() => navigate('/WeatherPage')}>
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
            <img src={cloudyIcon} alt="Cloudy" className="main-weather-icon" />

            <div className="temperature-stack">
              <h1 className="huge-temp">{cur ? `${cur.temp}°C` : "—"}</h1>
              <div className="weather-desc">
                <p>Feels like: {cur ? `${cur.feelsLike}°C` : "—"}</p>
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
          <p>Temperature ... {tod ? `${tod.tempHigh}° / ${tod.tempLow}°` : "—"}</p>
          <p>Wind speeds ... {tod ? `${tod.windSpeed}mph` : "—"}</p>
          <p>Humidity ... {tod ? `${tod.humidity}%` : "—"}</p>
          <p>Chance of rain ... {tod ? `${tod.pop}%` : "—"}</p>
          <p>Visibility ... {cur ? `${cur.visibility}mi` : "—"}</p>
        </div>

      </main>

      {/* BOTTOM */}
      <div className="bottom-forecast-area">
        <HourlyV2 hourly={w ? w.hourly : []} />
      </div>

    </div>
  );
}

export default TodayWeather;
