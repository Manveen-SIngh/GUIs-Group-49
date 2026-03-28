import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "./assets/PartlyCloudy.png";
import "./TodayWeather.css";
import backBtn from './assets/BackBtn.png';
import cloudyIcon from './assets/weather-icons/clouds.svg';
import HourlyV2 from "./components/HourlyV2";
import { fetchWeatherByCity } from "./services/weatherApi";
import SearchBar from "./components/SearchBar";

function TodayWeather() {
  const navigate = useNavigate();
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
    if (saved) loadWeather(saved);
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
        <img
          src={backBtn}
          alt="Back"
          onClick={() => navigate("/WeatherPage")}
          style={{ width: 64, height: 64, cursor: "pointer" }}
        />

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
            <img src={cloudyIcon} alt="Cloudy" className="main-weather-icon" />

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
          <p>Temperature ... {tod ? `${fmtTemp(tod.tempHigh)} / ${fmtTemp(tod.tempLow)}` : "—"}</p>
          <p>Wind speeds ... {tod ? fmtWind(tod.windSpeed) : "—"}</p>
          <p>Humidity ... {tod ? `${tod.humidity}%` : "—"}</p>
          <p>Chance of rain ... {tod ? `${tod.pop}%` : "—"}</p>
          <p>Visibility ... {cur ? fmtVis(cur.visibility) : "—"}</p>
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
