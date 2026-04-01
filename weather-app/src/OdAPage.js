// OdAPage.js
// "Outdoor Activity" detail page. Receives an activityKey prop
// ("cycling" | "hiking" | "running" | "camping") from the router and
// renders a full breakdown of weather conditions for that activity,
// including colour-coded metric boxes, activity scores, a map, and
// yesterday's precipitation for comparison.

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
  computeScore,
} from "./services/weatherApi";
import fallbackBg from "./assets/PartlyCloudy.png";

import ActivityScoresBox, { ACTIVITIES } from "./components/ActivityScoresBox";
import MapCard from "./components/MapCard";
// Arrow icons for the temperature hi/lo display
import hiArrow         from "./assets/redArrowUp.svg";
import loArrow         from "./assets/blueArrowDown.svg";
// Weather icons used in the precipitation section
import partlySunnyIcon from "./assets/weather-icons/sun-clouds.svg";
import rainyIcon        from "./assets/weather-icons/rainy.svg";
import sunnyIcon        from "./assets/weather-icons/Sunny.svg";
import cloudsIcon       from "./assets/weather-icons/clouds.svg";
import stormyIcon       from "./assets/weather-icons/stormy.svg";
import windyIcon        from "./assets/weather-icons/windy.svg";
import windDirection    from "./assets/Compass.png";

// Helpers

// getConditionIcon maps an OpenWeather condition string to the right SVG icon
const getConditionIcon = (condition) => {
  if (condition === "Clear")                            return sunnyIcon;
  if (condition === "Clouds")                           return cloudsIcon;
  if (condition === "Rain" || condition === "Drizzle")  return rainyIcon;
  if (condition === "Thunderstorm")                     return stormyIcon;
  if (condition === "Wind")                             return windyIcon;
  return partlySunnyIcon; // default for anything else 
};

// Icons that reflect the actual precipitation level rather than general condition
// Used for the "Today" precipitation box — not the same as the page background icon
const getPrecipIcon = (pop) => {
  if (pop < 20) return sunnyIcon;
  if (pop < 40) return partlySunnyIcon;
  if (pop < 70) return rainyIcon;
  return stormyIcon;
};

// getPrevPrecipIcon maps a previous-rain label string to an icon,
// used for the "yesterday" column in the precipitation box
const getPrevPrecipIcon = (label) => {
  if (label === "No")    return sunnyIcon;
  if (label === "Storm") return stormyIcon;
  return rainyIcon;
};

// Per-activity thresholds — [green cutoff, yellow cutoff]
// These define when a metric turns from green -> orange -> red for each activity.
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

// ─── Colour helper functions ──────────────────────────────────────────────────
// Each function returns a hex colour string: green, orange, or red.
// They all look up thresholds from ACTIVITY_THRESHOLDS for the given activity.

// rainColor: green below the first threshold, orange below the second, red otherwise
const rainColor = (pop, activityKey) => {
  const [g, y] = ACTIVITY_THRESHOLDS.rain[activityKey] ?? [30, 60];
  return pop < g ? "#3BC50F" : pop < y ? "#FFAB1C" : "#FF4A3A";
};

// prevRainColor colours yesterday's rain swatch based on the severity
const prevRainColor = ({ condition, rainMm }) => {
  if (condition === "Thunderstorm" || rainMm >= 7.5) return "#FF4A3A"; // storm/heavy = red
  if (condition === "Rain" || condition === "Drizzle" || rainMm > 0) return "#FFAB1C"; // any rain = orange
  return "#3BC50F"; // no rain = green
};

// prevRainLabel classifies yesterday's rain into a human-readable string
const prevRainLabel = ({ condition, rainMm }) => {
  if (condition === "Thunderstorm") return "Storm";
  if (rainMm >= 7.5)  return "Heavy";
  if (rainMm >= 2.5)  return "Moderate";
  if (rainMm > 0 || condition === "Rain" || condition === "Drizzle") return "Light";
  return "No";
};

// tempColor converts the displayed temperature back to Celsius for comparison
// because the thresholds are always stored in °C
const tempColor = (hi, tempLabel, activityKey) => {
  const c = tempLabel === "°F" ? (hi - 32) * (5 / 9) : hi;
  const [min, ideal, ok] = ACTIVITY_THRESHOLDS.temp[activityKey] ?? [5, 28, 34];
  return (c >= min && c <= ideal) ? "#3BC50F" : c <= ok ? "#FFAB1C" : "#FF4A3A";
};

// humidColor: lower humidity is generally better for outdoor activities
const humidColor = (hi, activityKey) => {
  const [g, y] = ACTIVITY_THRESHOLDS.humidity[activityKey] ?? [60, 80];
  return hi < g ? "#3BC50F" : hi < y ? "#FFAB1C" : "#FF4A3A";
};

// visColor: higher visibility is better — note the threshold order is reversed
// (g and y are minimums, not maximums)
const visColor = (vis, distLabel, activityKey) => {
  const km = distLabel === "mi" ? vis * 1.60934 : distLabel === "m" ? vis / 1000 : vis;
  const [g, y] = ACTIVITY_THRESHOLDS.visibility[activityKey] ?? [8, 3];
  return km > g ? "#3BC50F" : km > y ? "#FFAB1C" : "#FF4A3A";
};

// uvColorFn: lower UV is better — high UV is a red flag for outdoor activities
const uvColorFn = (uvi, activityKey) => {
  const [g, y] = ACTIVITY_THRESHOLDS.uv[activityKey] ?? [3, 6];
  return uvi < g ? "#3BC50F" : uvi < y ? "#FFAB1C" : "#FF4A3A";
};

// windColorFn converts from m/s to km/h before comparing against thresholds
// (the thresholds are in km/h for readability)
const windColorFn = (speedMs, activityKey) => {
  const kmh = speedMs * 3.6;
  const [g, y] = ACTIVITY_THRESHOLDS.wind[activityKey] ?? [20, 40];
  return kmh < g ? "#3BC50F" : kmh < y ? "#FFAB1C" : "#FF4A3A";
};

// Utility conversion helpers used inline where we need a common unit
const toCelsius = (temp, tempLabel) => tempLabel === "°F" ? (temp - 32) * (5 / 9) : temp;
const toKilometers = (distance, distLabel) => {
  if (distLabel === "mi") return distance * 1.60934;
  if (distLabel === "m") return distance / 1000;
  return distance;
};


// ─── Component ───────────────────────────────────────────────────────────────

/**
 * @param {{ activityKey: "cycling"|"hiking"|"camping"|"running" }} props
 */
function OdAPage({ activityKey }) {
  // weather holds the full payload from buildWeatherPayload
  const [weather, setWeather]       = useState(null);
  // prevPrecip is the result of the timemachine API call for yesterday
  const [prevPrecip, setPrevPrecip] = useState(null);
  const [query, setQuery]           = useState("");

  // Initialise unit state from localStorage so it persists across navigation
  const [tempUnit, setTempUnit] = useState(() => {
    const s = getUnitSettings();
    return s.Temperature === "Fahrenheit (F)" ? "F" : "C";
  });
  const [distUnit, setDistUnit] = useState(() => {
    const s = getUnitSettings();
    return s.Distance && s.Distance.includes("mi") ? "mi" : "km";
  });

  // reloadWithSettings re-fetches weather with a new unit settings object.
  // Called whenever the user toggles temperature or distance units.
  const reloadWithSettings = (settingsOverride) => {
    const city = localStorage.getItem("lastCity");
    if (city) {
      fetchWeatherByCity(city, settingsOverride).then(setWeather).catch(console.error);
    } else if (weather?.lat && weather?.lon) {
      fetchWeatherByCoords(weather.lat, weather.lon, settingsOverride).then(setWeather).catch(console.error);
    }
  };

  // buildLocalOverride merges the existing saved settings with the newly
  // selected temp/dist units. Changing distance also changes wind speed units
  // to keep them consistent (mi -> mph, km -> km/h).
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

  // handleSearch is called when the user submits a city in the TopBar
  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    localStorage.setItem("lastCity", q);
    fetchWeatherByCity(q)
      .then((data) => {
        setWeather(data);
        // Cache the full payload so other pages can read it without re-fetching
        localStorage.setItem("cachedWeather", JSON.stringify(data));
      })
      .catch(console.error);
  };

  // Unit toggle handlers: update state, rebuild override, and re-fetch data
  const handleTempToggle = (unit) => {
    setTempUnit(unit);
    reloadWithSettings(buildLocalOverride(unit, distUnit));
  };

  const handleDistToggle = (unit) => {
    setDistUnit(unit);
    reloadWithSettings(buildLocalOverride(tempUnit, unit));
  };

  // On first mount: load the last searched city, or fall back to geolocation
  useEffect(() => {
    const saved = localStorage.getItem("lastCity");
    if (saved) {
      fetchWeatherByCity(saved).then(setWeather).catch(console.error);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude)
                   .then(setWeather).catch(console.error),
        () => {} // silently ignore permission denied
      );
    }
  }, []);

  // Whenever we get new coordinates, fetch yesterday's precip for comparison.
  // We check the cache first to avoid an unnecessary API call on re-renders.
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

  // pageLabel is the display name of the current activity (e.g. "Cycling")
  const pageLabel = ACTIVITIES.find((a) => a.key === activityKey)?.label ?? activityKey;
  const D = "—"; // placeholder shown while data is loading

  // Shorthand aliases so the JSX below isn't full of long chains
  const today   = weather ? weather.today   : null;
  const current = weather ? weather.current : null;
  const labels  = weather ? weather.unitLabels : { temp: "°C", wind: "km/h", dist: "km" };

  // Re-compute scores from today's data whenever weather updates.
  // We always use raw °C/km internally so the score curves are stable.
  const computedScores = today ? {
    cycling: computeScore("cycling", today, labels),
    hiking:  computeScore("hiking",  today, labels),
    running: computeScore("running", today, labels),
    camping: computeScore("camping", today, labels),
  } : null;

  // score and mainMsg/mainColor drive the big header display at the top of the page
  const score     = computedScores ? computedScores[activityKey] : null;
  const mainColor = score != null ? scoreColor(score) : "#FFAB1C"; // amber while loading
  const mainMsg   = score != null ? activityMessage(activityKey, score) : "Loading…";

  // Background image switches based on current weather condition + day/night
  let currentBg = fallbackBg;
  if (current) {
    const isNight = current.nowHour < current.sunriseHour || current.nowHour >= current.sunsetHour;
    currentBg = getBackgroundImage(current.condition, isNight);
  }

  // ─── JSX ─────────────────────────────────────────────────────────────────
  // Layout: TopBar, header row (activity name + score), then a 4-column grid:
  //   col 1 — activity scores box + map
  //   col 2 — precipitation + temperature boxes
  //   col 3 — humidity + visibility boxes
  //   col 4 — wind speed + UV index (slim boxes)
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
            {/* Colour swatch + numeric score */}
            <div className="oda-score-row">
              <div className="oda-score-swatch" style={{ background: mainColor }} />
              <div className="oda-score-value">{score != null ? `${score}/10` : D}</div>
            </div>
            {/* Short message describing the conditions for this activity */}
            <div className="oda-score-message">{mainMsg}</div>
          </div>
        </div>

        {/* ── Grid ───────────────────────────────────────────────── */}
        <div className="oda-grid">

          {/* Column 1: Scores + Map */}
          <div className="oda-col">
            {/* ActivityScoresBox shows all four activities; the current one is highlighted */}
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

            {/* Precipitation box: today vs yesterday side by side */}
            <div className="oda-box">
              <div className="oda-box-header">
                {/* Swatch colour driven by how much rain is expected today */}
                <div className="oda-swatch" style={{ background: today ? rainColor(today.pop, activityKey) : "#FFAB1C" }} />
                <span className="oda-box-title">Precipitation</span>
              </div>
              <div className="oda-precip-row">
                {/* Today's precipitation column */}
                <div className="oda-precip-col">
                  <img className="oda-precip-icon" src={today ? getPrecipIcon(today.pop) : partlySunnyIcon} alt="Today weather" />
                  <span className="oda-precip-label">Today</span>
                  <div className="oda-precip-score-row">
                    <div className="oda-swatch oda-swatch--sm" style={{ background: today ? rainColor(today.pop, activityKey) : "#FFAB1C" }} />
                    <span className="oda-precip-value">{today ? `${today.pop}%` : D}</span>
                  </div>
                </div>
                {/* Yesterday's precipitation column (from the timemachine API call) */}
                <div className="oda-precip-col">
                  <img className="oda-precip-icon" src={prevPrecip ? getPrevPrecipIcon(prevRainLabel(prevPrecip)) : partlySunnyIcon} alt="Previous weather" />
                  <span className="oda-precip-label">Prev.</span>
                  <div className="oda-precip-score-row">
                    <div className="oda-swatch oda-swatch--sm" style={{ background: prevPrecip ? prevRainColor(prevPrecip) : "#FFAB1C" }} />
                    <span className="oda-precip-value">{prevPrecip ? prevRainLabel(prevPrecip) : D}<br />rain</span>
                  </div>
                </div>
              </div>
              {/* Simple text summary of ground conditions */}
              <div className="oda-precip-message">
                {today ? (today.pop < 30 ? "Dry Conditions" : today.pop < 60 ? "Some Rain" : "Wet Ground") : D}
              </div>
            </div>

            {/* Temperature box: daily high/low + live current reading */}
            <div className="oda-box">
              <div className="oda-box-header">
                <div className="oda-swatch" style={{ background: today ? tempColor(today.tempHigh, labels.temp, activityKey) : "#FFAB1C" }} />
                <span className="oda-box-title">Temperature</span>
              </div>
              <div className="oda-section-label">Today:</div>
              <div className="oda-hi-lo-row">
                {/* Red arrow = high, blue arrow = low */}
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

            {/* Humidity box: daily hi/lo and current reading */}
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
              {/* Current humidity only has one value, so Hi and Lo show the same number */}
              <div className="oda-hi-lo-row">
                <span className="oda-hi-label">Hi</span>
                <span className="oda-hi-lo-value">{current ? `${current.humidity}%` : D}</span>
                <span className="oda-lo-label">Lo</span>
                <span className="oda-hi-lo-value">{current ? `${current.humidity}%` : D}</span>
              </div>
            </div>

            {/* Visibility box: daily hi/lo and current reading */}
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

            {/* Wind speed box with a compass rose that rotates to show wind direction */}
            <div className="oda-box oda-box--slim">
              <div className="oda-box-header">
                <div className="oda-swatch" style={{ background: today ? windColorFn(today.windSpeedMs, activityKey) : "#FFAB1C" }} />
                <span className="oda-box-title">Wind<br />Speed</span>
              </div>
              {/* CSS rotate() turns the compass to match the wind bearing */}
              <img
                className="oda-compass"
                src={windDirection}
                alt="Wind direction"
                style={{ transform: `rotate(${today ? today.windDeg : 0}deg)` }}
              />
              <div className="oda-wind-value">{today ? `${today.windSpeed} ${labels.wind}` : D}</div>
              <div className="oda-wind-avg">Daily<br />Average</div>
            </div>

            {/* UV Index box — just shows the highest level for today */}
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
