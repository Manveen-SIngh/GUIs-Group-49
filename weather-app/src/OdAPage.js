import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";

import "./OdAPage.css";

import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  fetchYesterdayPrecip,
  scoreColor,
  activityMessage,
  getBackgroundImage,
  getUnitSettings,
} from "./services/weatherApi";
import fallbackBg from "./assets/PartlyCloudy.png";

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

// Per-activity thresholds — [green cutoff, yellow cutoff]
// temp: [idealMin °C, idealMax °C, okMax °C]   vis/wind: metric units
const ACTIVITY_THRESHOLDS = {
  rain: {                       // pop %
    cycling: [20, 50],
    hiking:  [30, 60],
    camping: [20, 40],
    running: [30, 60],
  },
  temp: {                       // °C [idealMin, idealMax, okMax]
    cycling: [10, 25, 30],
    hiking:  [8,  22, 28],
    camping: [10, 25, 30],
    running: [8,  20, 25],
  },
  humidity: {                   // %
    cycling: [60, 80],
    hiking:  [70, 85],
    camping: [60, 80],
    running: [55, 75],
  },
  visibility: {                 // km [greenMin, yellowMin]
    cycling: [10, 5],
    hiking:  [5,  2],
    camping: [3,  1],
    running: [3,  1],
  },
  wind: {                       // km/h
    cycling: [15, 30],
    hiking:  [25, 50],
    camping: [20, 40],
    running: [20, 35],
  },
  uv: {                         // index
    cycling: [3, 6],
    hiking:  [5, 8],
    camping: [5, 8],
    running: [3, 6],
  },
};

const rainColor = (pop, activityKey) => {
  const [g, y] = ACTIVITY_THRESHOLDS.rain[activityKey] ?? [30, 60];
  return pop < g ? "#3BC50F" : pop < y ? "#FFAB1C" : "#FF4A3A";
};
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
  return "No";
};
const tempColor = (hi, tempLabel, activityKey) => {
  const c = tempLabel === "°F" ? (hi - 32) * (5 / 9) : hi;
  const [min, ideal, ok] = ACTIVITY_THRESHOLDS.temp[activityKey] ?? [5, 28, 34];
  return (c >= min && c <= ideal) ? "#3BC50F" : c <= ok ? "#FFAB1C" : "#FF4A3A";
};
const humidColor = (hi, activityKey) => {
  const [g, y] = ACTIVITY_THRESHOLDS.humidity[activityKey] ?? [60, 80];
  return hi < g ? "#3BC50F" : hi < y ? "#FFAB1C" : "#FF4A3A";
};
const visColor = (vis, distLabel, activityKey) => {
  const km = distLabel === "mi" ? vis * 1.60934 : distLabel === "m" ? vis / 1000 : vis;
  const [g, y] = ACTIVITY_THRESHOLDS.visibility[activityKey] ?? [8, 3];
  return km > g ? "#3BC50F" : km > y ? "#FFAB1C" : "#FF4A3A";
};
const uvColorFn = (uvi, activityKey) => {
  const [g, y] = ACTIVITY_THRESHOLDS.uv[activityKey] ?? [3, 6];
  return uvi < g ? "#3BC50F" : uvi < y ? "#FFAB1C" : "#FF4A3A";
};
const windColorFn = (speedMs, activityKey) => {
  const kmh = speedMs * 3.6;
  const [g, y] = ACTIVITY_THRESHOLDS.wind[activityKey] ?? [20, 40];
  return kmh < g ? "#3BC50F" : kmh < y ? "#FFAB1C" : "#FF4A3A";
};
const toCelsius = (temp, tempLabel) => tempLabel === "°F" ? (temp - 32) * (5 / 9) : temp;
const toKilometers = (distance, distLabel) => {
  if (distLabel === "mi") return distance * 1.60934;
  if (distLabel === "m") return distance / 1000;
  return distance;
};

// ─── Score computation from metric colours ────────────────────────────────────
// Maps each metric's colour to a 1–10 sub-score
const colorScore = (hex) => hex === "#3BC50F" ? 10 : hex === "#FFAB1C" ? 6 : 2;

// Per-activity weights across all six displayed metrics (must sum to 1.0)
const ACTIVITY_WEIGHTS = {
  cycling: { rain: 0.25, temp: 0.20, wind: 0.25, humidity: 0.10, visibility: 0.10, uv: 0.10 },
  hiking:  { rain: 0.20, temp: 0.20, wind: 0.15, humidity: 0.15, visibility: 0.10, uv: 0.20 },
  running: { rain: 0.20, temp: 0.25, wind: 0.15, humidity: 0.20, visibility: 0.05, uv: 0.15 },
  camping: { rain: 0.30, temp: 0.20, wind: 0.20, humidity: 0.15, visibility: 0.05, uv: 0.10 },
};

const computeScore = (actKey, today, labels) => {
  const w = ACTIVITY_WEIGHTS[actKey];
  const weighted =
    colorScore(rainColor(today.pop, actKey))                        * w.rain +
    colorScore(tempColor(today.tempHigh, labels.temp, actKey))      * w.temp +
    colorScore(humidColor(today.humidityHigh, actKey))              * w.humidity +
    colorScore(visColor(today.visibilityHigh, labels.dist, actKey)) * w.visibility +
    colorScore(windColorFn(today.windSpeedMs, actKey))              * w.wind +
    colorScore(uvColorFn(today.uvi, actKey))                        * w.uv;
  return Math.max(1, Math.min(10, Math.round(weighted)));
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * @param {{ activityKey: "cycling"|"hiking"|"camping"|"running" }} props
 */
function OdAPage({ activityKey }) {
  const [weather, setWeather]       = useState(null);
  const [prevPrecip, setPrevPrecip] = useState(null);
  const [query, setQuery]           = useState("");

  const [tempUnit, setTempUnit] = useState(() => {
    const s = getUnitSettings();
    return s.Temperature === "Fahrenheit (F)" ? "F" : "C";
  });
  const [distUnit, setDistUnit] = useState(() => {
    const s = getUnitSettings();
    return s.Distance && s.Distance.includes("mi") ? "mi" : "km";
  });

  const reloadWithSettings = (settingsOverride) => {
    const city = localStorage.getItem("lastCity");
    if (city) {
      fetchWeatherByCity(city, settingsOverride).then(setWeather).catch(console.error);
    } else if (weather?.lat && weather?.lon) {
      fetchWeatherByCoords(weather.lat, weather.lon, settingsOverride).then(setWeather).catch(console.error);
    }
  };

  const buildLocalOverride = (newTemp, newDist) => {
    const saved = localStorage.getItem("unitSettings");
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      ...parsed,
      Temperature: newTemp === "F" ? "Fahrenheit (F)" : "Celsius (C)",
      Distance: newDist === "mi" ? "Miles (mi)" : "Kilometers (km)",
      "Wind Speed": newDist === "mi" ? "Miles per hour (mph)" : "Kilometers per hour (km/h)",
    };
  };

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    localStorage.setItem("lastCity", q);
    fetchWeatherByCity(q)
      .then((data) => {
        setWeather(data);
        localStorage.setItem("cachedWeather", JSON.stringify(data));
      })
      .catch(console.error);
  };

  const handleTempToggle = (unit) => {
    setTempUnit(unit);
    reloadWithSettings(buildLocalOverride(unit, distUnit));
  };

  const handleDistToggle = (unit) => {
    setDistUnit(unit);
    reloadWithSettings(buildLocalOverride(tempUnit, unit));
  };

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

  const today   = weather ? weather.today   : null;
  const current = weather ? weather.current : null;
  const labels  = weather ? weather.unitLabels : { temp: "°C", wind: "km/h", dist: "km" };

  const computedScores = today ? {
    cycling: computeScore("cycling", today, labels),
    hiking:  computeScore("hiking",  today, labels),
    running: computeScore("running", today, labels),
    camping: computeScore("camping", today, labels),
  } : null;

  const score     = computedScores ? computedScores[activityKey] : null;
  const mainColor = score != null ? scoreColor(score) : "#FFAB1C";
  const mainMsg   = score != null ? activityMessage(activityKey, score) : "Loading…";

  let currentBg = fallbackBg;
  if (current) {
    const isNight = current.nowHour < current.sunriseHour || current.nowHour >= current.sunsetHour;
    currentBg = getBackgroundImage(current.condition, isNight);
  }

  return (
    <div
      className="oda-page-wrapper"
      style={{
        backgroundImage: `url(${currentBg})`,
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      <div className="oda-container">
        <TopBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          tempUnit={tempUnit}
          onTempToggle={handleTempToggle}
          distUnit={distUnit}
          onDistToggle={handleDistToggle}
        />

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="oda-header">
          <div className="oda-header-left">
            <div className="oda-subtitle">Outdoor Activity Summary</div>
            <div className="oda-activity-title">{pageLabel}:</div>
          </div>
          <div className="oda-header-right">
            <div className="oda-score-row">
              <div className="oda-score-swatch" style={{ background: mainColor }} />
              <div className="oda-score-value">{score != null ? `${score}/10` : D}</div>
            </div>
            <div className="oda-score-message">{mainMsg}</div>
          </div>
        </div>

        {/* ── Grid ───────────────────────────────────────────────── */}
        <div className="oda-grid">

          {/* Column 1: Scores + Map */}
          <div className="oda-col">
            <ActivityScoresBox activeKey={activityKey} scores={computedScores ?? weather?.scores} />
            <div className="oda-box oda-box--map">
              <MapCard
                lat={weather?.lat ?? 51.5072}
                lon={weather?.lon ?? -0.1276}
                locationName={weather?.locationName ?? "—"}
              />
            </div>
          </div>

          {/* Column 2: Precipitation + Temperature */}
          <div className="oda-col">

            {/* Precipitation */}
            <div className="oda-box">
              <div className="oda-box-header">
                <div className="oda-swatch" style={{ background: today ? rainColor(today.pop, activityKey) : "#FFAB1C" }} />
                <span className="oda-box-title">Precipitation</span>
              </div>
              <div className="oda-precip-row">
                <div className="oda-precip-col">
                  <img className="oda-precip-icon" src={today ? getConditionIcon(today.condition) : partlySunnyIcon} alt="Today weather" />
                  <span className="oda-precip-label">Today</span>
                  <div className="oda-precip-score-row">
                    <div className="oda-swatch oda-swatch--sm" style={{ background: today ? rainColor(today.pop, activityKey) : "#FFAB1C" }} />
                    <span className="oda-precip-value">{today ? `${today.pop}%` : D}</span>
                  </div>
                </div>
                <div className="oda-precip-col">
                  <img className="oda-precip-icon" src={prevPrecip ? getConditionIcon(prevPrecip.condition) : partlySunnyIcon} alt="Previous weather" />
                  <span className="oda-precip-label">Prev.</span>
                  <div className="oda-precip-score-row">
                    <div className="oda-swatch oda-swatch--sm" style={{ background: prevPrecip ? prevRainColor(prevPrecip) : "#FFAB1C" }} />
                    <span className="oda-precip-value">{prevPrecip ? prevRainLabel(prevPrecip) : D}<br />rain</span>
                  </div>
                </div>
              </div>
              <div className="oda-precip-message">
                {today ? (today.pop < 30 ? "Dry Conditions" : today.pop < 60 ? "Some Rain" : "Wet Ground") : D}
              </div>
            </div>

            {/* Temperature */}
            <div className="oda-box">
              <div className="oda-box-header">
                <div className="oda-swatch" style={{ background: today ? tempColor(today.tempHigh, labels.temp, activityKey) : "#FFAB1C" }} />
                <span className="oda-box-title">Temperature</span>
              </div>
              <div className="oda-section-label">Today:</div>
              <div className="oda-hi-lo-row">
                <div className="oda-hi-lo">
                  <img className="oda-arrow" src={hiArrow} alt="High" />
                  <span className="oda-hi-lo-value">{today ? `${today.tempHigh}${labels.temp}` : D}</span>
                </div>
                <div className="oda-hi-lo">
                  <img className="oda-arrow" src={loArrow} alt="Low" />
                  <span className="oda-hi-lo-value">{today ? `${today.tempLow}${labels.temp}` : D}</span>
                </div>
              </div>
              <div className="oda-section-label oda-section-label--spaced">Right Now:</div>
              <div className="oda-center-value">{current ? `${current.temp}${labels.temp}` : D}</div>
            </div>

          </div>

          {/* Column 3: Humidity + Visibility */}
          <div className="oda-col">

            {/* Humidity */}
            <div className="oda-box">
              <div className="oda-box-header">
                <div className="oda-swatch" style={{ background: today ? humidColor(today.humidityHigh, activityKey) : "#FFAB1C" }} />
                <span className="oda-box-title">Humidity</span>
              </div>
              <div className="oda-section-label">Today:</div>
              <div className="oda-hi-lo-row">
                <span className="oda-hi-label">Hi</span>
                <span className="oda-hi-lo-value">{today ? `${today.humidityHigh}%` : D}</span>
                <span className="oda-lo-label">Lo</span>
                <span className="oda-hi-lo-value">{today ? `${today.humidityLow}%` : D}</span>
              </div>
              <div className="oda-section-label oda-section-label--spaced">Currently:</div>
              <div className="oda-hi-lo-row">
                <span className="oda-hi-label">Hi</span>
                <span className="oda-hi-lo-value">{current ? `${current.humidity}%` : D}</span>
                <span className="oda-lo-label">Lo</span>
                <span className="oda-hi-lo-value">{current ? `${current.humidity}%` : D}</span>
              </div>
            </div>

            {/* Visibility */}
            <div className="oda-box">
              <div className="oda-box-header">
                <div className="oda-swatch" style={{ background: today ? visColor(today.visibilityHigh, labels.dist, activityKey) : "#FFAB1C" }} />
                <span className="oda-box-title">Visibility</span>
              </div>
              <div className="oda-section-label">Today:</div>
              <div className="oda-hi-lo-row">
                <span className="oda-hi-label">Hi</span>
                <span className="oda-hi-lo-value">{today ? `${today.visibilityHigh}${labels.dist}` : D}</span>
                <span className="oda-lo-label">Lo</span>
                <span className="oda-hi-lo-value">{today ? `${today.visibilityLow}${labels.dist}` : D}</span>
              </div>
              <div className="oda-section-label oda-section-label--spaced">Right Now:</div>
              <div className="oda-center-value">{current ? `${current.visibility}${labels.dist}` : D}</div>
            </div>

          </div>

          {/* Column 4: Wind + UV (slim) */}
          <div className="oda-col">

            {/* Wind */}
            <div className="oda-box oda-box--slim">
              <div className="oda-box-header">
                <div className="oda-swatch" style={{ background: today ? windColorFn(today.windSpeedMs, activityKey) : "#FFAB1C" }} />
                <span className="oda-box-title">Wind<br />Speed</span>
              </div>
              <img
                className="oda-compass"
                src={windDirection}
                alt="Wind direction"
                style={{ transform: `rotate(${today ? today.windDeg : 0}deg)` }}
              />
              <div className="oda-wind-value">{today ? `${today.windSpeed} ${labels.wind}` : D}</div>
              <div className="oda-wind-avg">Daily<br />Average</div>
            </div>

            {/* UV */}
            <div className="oda-box oda-box--slim">
              <div className="oda-box-header">
                <div className="oda-swatch" style={{ background: today ? uvColorFn(today.uvi, activityKey) : "#FFAB1C" }} />
                <span className="oda-box-title">UV</span>
              </div>
              <div className="oda-uv-label">Daily<br />Highest<br />Level:</div>
              <div className="oda-uv-value">{today ? today.uvLabel : D}</div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default OdAPage;
