import { useState, useEffect, useRef } from "react";
import { fetchWeatherByCity, fetchWeatherByCoords, getBackgroundImage, scoreColor, activityMessage } from "./services/weatherApi";
import fallbackBg from "./assets/PartlyCloudy.png";

import "./TodayWeather.css";
import TopBar from "./components/TopBar";
import sunnyIcon      from './assets/weather-icons/Sunny.svg';
import cloudsIcon     from './assets/weather-icons/clouds.svg';
import rainyIcon      from './assets/weather-icons/rainy.svg';
import stormyIcon     from './assets/weather-icons/stormy.svg';
import windyIcon      from './assets/weather-icons/windy.svg';
import partlyIcon     from './assets/weather-icons/sun-clouds.svg';
import HourlyV2 from "./components/HourlyV2";
import hikingIcon  from './assets/Activity-icons/hiking.svg';
import runningIcon from './assets/Activity-icons/running.svg';
import cyclingIcon from './assets/Activity-icons/cycling.svg';
import campingIcon from './assets/Activity-icons/camping.svg';

const tempColor  = (hi)       => hi >= 5 && hi <= 28 ? "#3BC50F" : hi <= 34 ? "#FFAB1C" : "#FF4A3A";
const humidColor = (hi)       => hi < 60   ? "#3BC50F" : hi < 80   ? "#FFAB1C" : "#FF4A3A";
const rainColor  = (pop)      => pop < 30  ? "#3BC50F" : pop < 60  ? "#FFAB1C" : "#FF4A3A";
const visColor   = (vis)      => vis > 8   ? "#3BC50F" : vis > 3   ? "#FFAB1C" : "#FF4A3A";
const uvColorFn  = (uvi)      => uvi < 3   ? "#3BC50F" : uvi < 6   ? "#FFAB1C" : "#FF4A3A";
const windColorFn = (spd, lbl) => {
  const kmh = lbl === "mph" ? spd * 1.60934 : lbl === "m/s" ? spd * 3.6 : spd;
  return kmh < 20 ? "#3BC50F" : kmh < 40 ? "#FFAB1C" : "#FF4A3A";
};

const getConditionIcon = (condition) => {
  if (condition === "Clear")                           return sunnyIcon;
  if (condition === "Clouds")                          return cloudsIcon;
  if (condition === "Rain" || condition === "Drizzle") return rainyIcon;
  if (condition === "Thunderstorm")                    return stormyIcon;
  if (condition === "Wind")                            return windyIcon;
  return partlyIcon;
};

function TodayWeather() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  // Initialize state from localStorage to keep UI in sync with Settings
  const ACTIVITIES = [
    { key: "cycling", label: "Cycling", icon: cyclingIcon },
    { key: "hiking",  label: "Hiking",  icon: hikingIcon  },
    { key: "camping", label: "Camping", icon: campingIcon },
    { key: "running", label: "Running", icon: runningIcon },
  ];
  const [activityIndex, setActivityIndex] = useState(0);
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setActivityIndex((i) => (i + 1) % ACTIVITIES.length);
      else          setActivityIndex((i) => (i - 1 + ACTIVITIES.length) % ACTIVITIES.length);
    }
    touchStartX.current = null;
  };

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

  // Toggles only affect this page — no localStorage write, re-fetch with override
  const handleTempToggle = (unit) => {
    setTempUnit(unit);
    if (weather) {
      const saved = localStorage.getItem("unitSettings");
      const parsed = saved ? JSON.parse(saved) : {};
      const override = { ...parsed, Temperature: unit === "F" ? "Fahrenheit (F)" : "Celsius (C)" };
      loadWeather(weather.locationName, override);
    }
  };

  const handleDistToggle = (unit) => {
    setDistUnit(unit);
    if (weather) {
      const saved = localStorage.getItem("unitSettings");
      const parsed = saved ? JSON.parse(saved) : {};
      const override = {
        ...parsed,
        Distance: unit === "mi" ? "Miles (mi)" : "Kilometers (km)",
        "Wind Speed": unit === "mi" ? "Miles per hour (mph)" : "Kilometers per hour (km/h)",
      };
      loadWeather(weather.locationName, override);
    }
  };

  // Helper functions: API provides the number, we provide the label
  const fmtTemp = (val) => val == null ? "—" : `${Math.round(val)}°${tempUnit}`;
  const fmtWind = (val) => val == null ? "—" : `${Math.round(val)}${distUnit === "mi" ? "mph" : "km/h"}`;
  const fmtVis  = (val) => val == null ? "—" : `${val} ${w?.unitLabels?.dist ?? distUnit}`;

  const loadWeather = async (city, settingsOverride = null) => {
    try {
      setError("");
      const data = await fetchWeatherByCity(city, settingsOverride);
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
      <TopBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSearch={handleSearch}
        tempUnit={tempUnit}
        onTempToggle={handleTempToggle}
        distUnit={distUnit}
        onDistToggle={handleDistToggle}
      />

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

        <div
          className="metrics-card"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {(() => {
            const act = ACTIVITIES[activityIndex];
            const actScore = scores ? scores[act.key] : null;
            const actColor = actScore != null ? scoreColor(actScore) : "#FFAB1C";
            const actMsg   = actScore != null ? activityMessage(act.key, actScore) : "Loading…";
            return (
              <>
                <div className="metrics-header">
                  <div className="metrics-activity-title">
                    <span className="metrics-activity-icon-wrap" style={{ background: actColor }} />
                    <h2>{act.label}</h2>
                  </div>
                  <h2>{actScore != null ? `${actScore}/10` : "—"}</h2>
                </div>
                <p className="metrics-activity-msg">{actMsg}</p>
                <div className="metrics-dots">
                  {ACTIVITIES.map((_, i) => (
                    <span
                      key={i}
                      className={`metrics-dot${i === activityIndex ? " metrics-dot--active" : ""}`}
                      onClick={() => setActivityIndex(i)}
                    />
                  ))}
                </div>
              </>
            );
          })()}
          <div className="metric-row">
            <span className="metric-swatch" style={{ background: tod ? tempColor(tod.tempHigh) : "#FFAB1C" }} />
            <span className="metric-label">Temperature</span>
            <span className="metric-value">{tod ? `${fmtTemp(tod.tempHigh)} / ${fmtTemp(tod.tempLow)}` : "—"}</span>
          </div>
          <div className="metric-row">
            <span className="metric-swatch" style={{ background: tod ? windColorFn(tod.windSpeed, w?.unitLabels?.wind) : "#FFAB1C" }} />
            <span className="metric-label">Wind</span>
            <span className="metric-value">{tod ? fmtWind(tod.windSpeed) : "—"}</span>
          </div>
          <div className="metric-row">
            <span className="metric-swatch" style={{ background: tod ? humidColor(tod.humidityHigh) : "#FFAB1C" }} />
            <span className="metric-label">Humidity</span>
            <span className="metric-value">{tod ? `${tod.humidity}%` : "—"}</span>
          </div>
          <div className="metric-row">
            <span className="metric-swatch" style={{ background: tod ? rainColor(tod.pop) : "#FFAB1C" }} />
            <span className="metric-label">Rain</span>
            <span className="metric-value">{tod ? `${tod.pop}%` : "—"}</span>
          </div>
          <div className="metric-row">
            <span className="metric-swatch" style={{ background: cur?.uvi != null ? uvColorFn(cur.uvi) : "#FFAB1C" }} />
            <span className="metric-label">UV Index</span>
            <span className="metric-value">{cur ? (cur.uvi ?? "—") : "—"}</span>
          </div>
          <div className="metric-row">
            <span className="metric-swatch" style={{ background: tod ? visColor(tod.visibilityHigh) : "#FFAB1C" }} />
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