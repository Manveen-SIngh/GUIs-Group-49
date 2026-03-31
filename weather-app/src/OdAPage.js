import { useState, useEffect } from "react";
import { useSidebar } from "./Sidebar";

import "./OdAPage.css";

// 1. Updated Background Imports
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  fetchYesterdayPrecip,
  scoreColor,
  activityMessage,
  getBackgroundImage,
  getUnitSettings,
} from "./services/weatherApi";
import fallbackBg from "./assets/PartlyCloudy.png"; // Renamed for clarity

import menuIcon from "./assets/menu.svg";
import ActivityScoresBox, { ACTIVITIES } from "./components/ActivityScoresBox";
import MapCard from "./components/MapCard";
import hiArrow         from "./assets/redArrowUp.svg";
import loArrow         from "./assets/blueArrowDown.svg";
import partlySunnyIcon from "./assets/weather-icons/sun-clouds.svg";
import rainyIcon        from "./assets/weather-icons/rainy.svg";
import sunnyIcon        from "./assets/weather-icons/Sunny.svg";
import cloudsIcon       from "./assets/weather-icons/clouds.svg";
import stormyIcon       from "./assets/weather-icons/stormy.svg";
import windyIcon        from "./assets/weather-icons/windy.svg";
import windDirection    from "./assets/Compass.png";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getConditionIcon = (condition) => {
  if (condition === "Clear")                            return sunnyIcon;
  if (condition === "Clouds")                           return cloudsIcon;
  if (condition === "Rain" || condition === "Drizzle")  return rainyIcon;
  if (condition === "Thunderstorm")                     return stormyIcon;
  if (condition === "Wind")                             return windyIcon;
  return partlySunnyIcon;
};

const rainColor   = (pop)      => pop < 30  ? "#3BC50F" : pop < 60  ? "#FFAB1C" : "#FF4A3A";

const prevRainColor = ({ condition, rainMm }) => {
  if (condition === "Thunderstorm" || rainMm >= 7.5) return "#FF4A3A";
  if (condition === "Rain" || condition === "Drizzle" || rainMm > 0) return "#FFAB1C";
  return "#3BC50F";
};
const prevRainLabel = ({ condition, rainMm }) => {
  if (condition === "Thunderstorm") return "Storm";
  if (rainMm >= 7.5)  return "Heavy";
  if (rainMm >= 2.5)  return "Moderate";
  if (rainMm > 0 || condition === "Rain" || condition === "Drizzle") return "Light";
  return "None";
};
const tempColor   = (hi)       => hi >= 5 && hi <= 28 ? "#3BC50F" : hi <= 34 ? "#FFAB1C" : "#FF4A3A";
const humidColor  = (hi)       => hi < 60   ? "#3BC50F" : hi < 80   ? "#FFAB1C" : "#FF4A3A";
const visColor    = (vis)      => vis > 8   ? "#3BC50F" : vis > 3   ? "#FFAB1C" : "#FF4A3A";
const uvColorFn   = (uvi)      => uvi < 3   ? "#3BC50F" : uvi < 6   ? "#FFAB1C" : "#FF4A3A";
const windColorFn = (spd, lbl) => {
  const kmh = lbl === "mph" ? spd * 1.60934 : lbl === "m/s" ? spd * 3.6 : spd;
  return kmh < 20 ? "#3BC50F" : kmh < 40 ? "#FFAB1C" : "#FF4A3A";
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * @param {{ activityKey: "cycling"|"hiking"|"camping"|"running" }} props
 */
function OdAPage({ activityKey }) {
  const { open } = useSidebar();
  const [time, setTime]             = useState("");
  const [weather, setWeather]       = useState(null);
  const [prevPrecip, setPrevPrecip] = useState(null);

  // Local unit toggles — initialized from global settings, page-local only
  const [tempUnit, setTempUnit] = useState(() => {
    const s = getUnitSettings();
    return s.Temperature === "Fahrenheit (F)" ? "F" : "C";
  });
  const [distUnit, setDistUnit] = useState(() => {
    const s = getUnitSettings();
    return s.Distance && s.Distance.includes("mi") ? "mi" : "km";
  });

  // Clock
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Re-fetch with a settings override (page-local, no cache update)
  const reloadWithSettings = (settingsOverride) => {
    const city = localStorage.getItem("lastCity");
    if (city) {
      fetchWeatherByCity(city, settingsOverride).then(setWeather).catch(console.error);
    } else if (weather?.lat && weather?.lon) {
      fetchWeatherByCoords(weather.lat, weather.lon, settingsOverride).then(setWeather).catch(console.error);
    }
  };

  const handleTempToggle = (unit) => {
    setTempUnit(unit);
    const saved = localStorage.getItem("unitSettings");
    const parsed = saved ? JSON.parse(saved) : {};
    reloadWithSettings({ ...parsed, Temperature: unit === "F" ? "Fahrenheit (F)" : "Celsius (C)" });
  };

  const handleDistToggle = (unit) => {
    setDistUnit(unit);
    const saved = localStorage.getItem("unitSettings");
    const parsed = saved ? JSON.parse(saved) : {};
    reloadWithSettings({
      ...parsed,
      Distance: unit === "mi" ? "Miles (mi)" : "Kilometers (km)",
      "Wind Speed": unit === "mi" ? "Miles per hour (mph)" : "Kilometers per hour (km/h)",
    });
  };

  // Weather data
  useEffect(() => {
    const cached = localStorage.getItem("cachedWeather");
    if (cached) {
      try { setWeather(JSON.parse(cached)); } catch (_) {}
    }

    const save = (data) => {
      setWeather(data);
      localStorage.setItem("cachedWeather", JSON.stringify(data));
    };

    const saved = localStorage.getItem("lastCity");
    if (saved) {
      fetchWeatherByCity(saved).then(save).catch(console.error);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude)
                   .then(save).catch(console.error),
        () => {}
      );
    }
  }, []);

  // Fetch yesterday's precipitation
  useEffect(() => {
    if (!weather?.lat || !weather?.lon) return;
    const cached = localStorage.getItem("cachedPrevPrecip");
    if (cached) {
      try { setPrevPrecip(JSON.parse(cached)); } catch (_) {}
    }
    fetchYesterdayPrecip(weather.lat, weather.lon)
      .then((data) => {
        setPrevPrecip(data);
        localStorage.setItem("cachedPrevPrecip", JSON.stringify(data));
      })
      .catch(console.error);
  }, [weather?.lat, weather?.lon]);

  const pageLabel = ACTIVITIES.find((a) => a.key === activityKey)?.label ?? activityKey;
  const D = "—"; 

  const score   = weather ? weather.scores[activityKey] : null;
  const today   = weather ? weather.today   : null;
  const current = weather ? weather.current : null;
  const labels  = weather ? weather.unitLabels : { temp: "°C", wind: "km/h", dist: "km" };

  const mainColor = score != null ? scoreColor(score) : "#FFAB1C";
  const mainMsg   = score != null ? activityMessage(activityKey, score) : "Loading…";

  // 2. Dynamic Background Logic
  let currentBg = fallbackBg;
  if (current) {
    const isNight = current.nowHour < current.sunriseHour || current.nowHour >= current.sunsetHour;
    currentBg = getBackgroundImage(current.condition, isNight);
  }

  return (
    // 3. Updated styles to use dynamic background
    <div
      className="page-wrapper"
      style={{
        backgroundImage: `url(${currentBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        transition: "background-image 0.5s ease-in-out"
      }}
    >
      {/* ── Clock ───────────────────────────────────────────────── */}
      <div className="layer layer--shadow">
        <div className="clock-bg" />
        <div className="clock-display">{time}</div>
      </div>

      {/* ... (rest of the component remains the same) ... */}
      <div className="layer" style={{ zIndex: 50 }}>
        <div className="unit-distance-bg" style={{ pointerEvents: "none" }} />
        <div className="unit-distance-active" style={{ left: distUnit === "mi" ? 591 : 651, pointerEvents: "none" }} />
        <div className="unit-distance-mi" style={{ cursor: "pointer", zIndex: 1, position: "absolute" }} onClick={() => handleDistToggle("mi")}>mi</div>
        <div className="unit-distance-km" style={{ cursor: "pointer", zIndex: 1, position: "absolute" }} onClick={() => handleDistToggle("km")}>km</div>
      </div>

      <div className="layer" style={{ zIndex: 50 }}>
        <div className="unit-temp-bg" style={{ pointerEvents: "none" }} />
        <div className="unit-temp-active" style={{ left: tempUnit === "C" ? 418 : 471, pointerEvents: "none" }} />
        <div className="unit-temp-c" style={{ cursor: "pointer", zIndex: 1, position: "absolute" }} onClick={() => handleTempToggle("C")}>°C</div>
        <div className="unit-temp-f" style={{ cursor: "pointer", zIndex: 1, position: "absolute" }} onClick={() => handleTempToggle("F")}>°F</div>
      </div>

      <div className="layer" style={{ zIndex: 100, pointerEvents: "none" }}>
        <div className="menu-btn-bg" />
        <div className="menu-btn-icon-wrap" onClick={open} style={{ cursor: "pointer", pointerEvents: "auto" }}>
          <div className="menu-btn-icon-inner">
            <img src={menuIcon} alt="Menu" />
          </div>
        </div>
      </div>

      <div className="layer">
        <div className="header-subtitle">Outdoor Activity Summary</div>
        <div className="header-activity-title">{pageLabel}:</div>
      </div>

      <div className="layer layer--shadow">
        <div className="main-score-swatch" style={{ background: mainColor }} />
        <div className="main-score-value">{score != null ? `${score}/10` : D}</div>
        <div className="main-score-message">{mainMsg}</div>
      </div>

      <ActivityScoresBox activeKey={activityKey} scores={weather?.scores} />

      <div className="layer layer--shadow" style={{ position: "absolute", left: 277, top: 600, width: 349, height: 311, borderRadius: 43, overflow: "hidden", zIndex: 10 }}>
        <MapCard
          lat={weather?.lat ?? 51.5072}
          lon={weather?.lon ?? -0.1276}
          locationName={weather?.locationName ?? "—"}
        />
      </div>

      <div className="layer layer--shadow">
        <div className="temp-box" />
        <div className="temp-score-swatch" style={{ background: today ? tempColor(today.tempHigh) : "#FFAB1C" }} />
        <div className="temp-title">Temperature</div>
        <div className="temp-today-label">Today:</div>
        <div className="temp-hi-value">{today ? `${today.tempHigh}${labels.temp}` : D}</div>
        <img className="temp-hi-arrow" src={hiArrow} alt="High" />
        <div className="temp-lo-value">{today ? `${today.tempLow}${labels.temp}` : D}</div>
        <img className="temp-lo-arrow" src={loArrow} alt="Low" />
        <div className="temp-now-label">Right Now:</div>
        <div className="temp-now-value">{current ? `${current.temp}${labels.temp}` : D}</div>
      </div>

      <div className="layer layer--shadow">
        <div className="precip-box" />
        <div className="precip-score-swatch" style={{ background: today ? rainColor(today.pop) : "#FFAB1C" }} />
        <div className="precip-title">Precipitation</div>

        <img className="precip-icon-today" src={today ? getConditionIcon(today.condition) : partlySunnyIcon} alt="Today weather" />
        <div className="precip-today-label">Today</div>
        <div className="precip-today-score-swatch" style={{ background: today ? rainColor(today.pop) : "#FFAB1C" }} />
        <div className="precip-today-value">{today ? `${today.pop}%` : D}</div>

        <img className="precip-icon-prev" src={prevPrecip ? getConditionIcon(prevPrecip.condition) : partlySunnyIcon} alt="Previous weather" />
        <div className="precip-prev-label">Prev.</div>
        <div className="precip-prev-score-swatch" style={{ background: prevPrecip ? prevRainColor(prevPrecip) : "#FFAB1C" }} />
        <div className="precip-prev-value">{prevPrecip ? prevRainLabel(prevPrecip) : D}<br />rain</div>

        <div className="precip-message">
          {today ? (today.pop < 30 ? "Dry Conditions" : today.pop < 60 ? "Some Rain" : "Wet Ground") : D}
        </div>
      </div>

      <div className="layer layer--shadow">
        <div className="humidity-box" />
        <div className="humidity-score-swatch" style={{ background: today ? humidColor(today.humidityHigh) : "#FFAB1C" }} />
        <div className="humidity-title">Humidity</div>
        <div className="humidity-today-label">Today:</div>

        <div className="humidity-today-hi-label humidity-hi-label">Hi</div>
        <div className="humidity-today-hi-value humidity-value">{today ? `${today.humidityHigh}%` : D}</div>
        <div className="humidity-today-lo-label humidity-lo-label">Lo</div>
        <div className="humidity-today-lo-value humidity-value">{today ? `${today.humidityLow}%` : D}</div>

        <div className="humidity-prev-label">Currently:</div>
        <div className="humidity-prev-hi-label humidity-hi-label">Hi</div>
        <div className="humidity-prev-hi-value humidity-value">{current ? `${current.humidity}%` : D}</div>
        <div className="humidity-prev-lo-label humidity-lo-label">Lo</div>
        <div className="humidity-prev-lo-value humidity-value">{current ? `${current.humidity}%` : D}</div>
      </div>

      <div className="layer layer--shadow">
        <div className="visibility-box" />
        <div className="visibility-score-swatch" style={{ background: today ? visColor(today.visibilityHigh) : "#FFAB1C" }} />
        <div className="visibility-title">Visibility</div>
        <div className="visibility-today-label">Today:</div>
        <div className="visibility-hi-label">Hi</div>
        <div className="visibility-hi-value">{today ? `${today.visibilityHigh}${labels.dist}` : D}</div>
        <div className="visibility-lo-label">Lo</div>
        <div className="visibility-lo-value">{today ? `${today.visibilityLow}${labels.dist}` : D}</div>
        <div className="visibility-now-label">Right Now:</div>
        <div className="visibility-now-value">{current ? `${current.visibility}${labels.dist}` : D}</div>
      </div>

      <div className="layer layer--shadow">
        <div className="wind-box" />
        <div className="wind-score-swatch" style={{ background: today ? windColorFn(today.windSpeed, labels.wind) : "#FFAB1C" }} />
        <div className="wind-title">Wind<br />Speed</div>
        <img
          className="wind-compass"
          src={windDirection}
          alt="Wind direction"
          style={{ transform: `rotate(${today ? today.windDeg : 0}deg)` }}
        />
        <div className="wind-speed-value">{today ? `${today.windSpeed} ${labels.wind}` : D}</div>
        <div className="wind-avg-label">Daily<br /> Average</div>
      </div>

      <div className="layer layer--shadow">
        <div className="uv-box" />
        <div className="uv-score-swatch" style={{ background: today ? uvColorFn(today.uvi) : "#FFAB1C" }} />
        <div className="uv-title">UV</div>
        <div className="uv-daily-label">Daily <br /> Highest <br /> Level:</div>
        <div className="uv-daily-value">{today ? today.uvLabel : D}</div>
      </div>

    </div>
  );
}

export default OdAPage;