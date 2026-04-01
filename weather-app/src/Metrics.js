import { useState, useEffect } from "react";

import TopBar from "./components/TopBar";
import WeatherBox from "./components/WeatherBox";
import WindBox from "./components/WindBox";
import SunriseSunsetBox from "./components/SunriseSunsetBox";
import UVBox from "./components/UVBox";
import VisibilityBox from "./components/VisibilityBox";
import HumidityBox from "./components/HumidityBox";

import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  getBackgroundImage,
  getUnitSettings,
} from "./services/weatherApi";
import fallbackBg from "./assets/backgrounds/weather-partly-cloudy.svg";
import "./Metrics.css";

function Metrics() {
  // Main weather payload returned from API
  const [weather, setWeather] = useState(null);

  // Search input value from TopBar
  const [searchInput, setSearchInput] = useState("");

  // Error message shown when API fails
  const [error, setError] = useState("");

  // Temperature unit (local to this page, not globally persisted)
  const [tempUnit, setTempUnit] = useState(() => {
    const settings = getUnitSettings();
    return settings.Temperature === "Fahrenheit (F)" ? "F" : "C";
  });

  // Distance + wind unit (linked since they share metric/imperial system)
  const [distUnit, setDistUnit] = useState(() => {
    const settings = getUnitSettings();
    return settings.Distance === "Miles (mi)" ? "mi" : "km";
  });

  /**
   * Fetch weather using a city name.
   * Also persists last searched city for reloads.
   */
  const loadWeather = async (city, settingsOverride = null) => {
    try {
      setError("");

      const data = await fetchWeatherByCity(city, settingsOverride);

      setWeather(data);

      // Save last successful search for future reload
      localStorage.setItem("lastCity", city);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Re-fetch weather when units change.
   * Keeps same location but applies new unit settings.
   */
  const refreshWeatherWithUnits = (override) => {
    const city = localStorage.getItem("lastCity");

    // If user searched a city before, use that
    if (city) {
      fetchWeatherByCity(city, override)
        .then(setWeather)
        .catch(console.error);
      return;
    }

    // Otherwise fallback to coordinates if available
    if (weather?.lat && weather?.lon) {
      fetchWeatherByCoords(weather.lat, weather.lon, override)
        .then(setWeather)
        .catch(console.error);
    }
  };

  /**
   * Handle temperature toggle (C <-> F)
   * Builds override settings without modifying global storage directly.
   */
  const handleTempChange = (unit) => {
    const nextUnit = unit === "F" ? "Fahrenheit (F)" : "Celsius (C)";

    setTempUnit(unit);

    // Merge existing settings with new temperature unit
    const saved = localStorage.getItem("unitSettings");
    const parsed = saved ? JSON.parse(saved) : {};

    const override = { ...parsed, Temperature: nextUnit };

    refreshWeatherWithUnits(override);
  };

  /**
   * Handle distance + wind unit toggle (km <-> miles)
   * Updates both distance and wind speed together.
   */
  const handleDistChange = (unit) => {
    const isImperial = unit === "mi";

    const nextDistUnit = isImperial
      ? "Miles (mi)"
      : "Kilometers (km)";

    const nextWindUnit = isImperial
      ? "Miles per hour (mph)"
      : "Kilometers per hour (km/h)";

    setDistUnit(unit);

    const saved = localStorage.getItem("unitSettings");
    const parsed = saved ? JSON.parse(saved) : {};

    const override = {
      ...parsed,
      Distance: nextDistUnit,
      "Wind Speed": nextWindUnit,
    };

    refreshWeatherWithUnits(override);
  };

  /**
   * On first load:
   * 1. Try last searched city
   * 2. Otherwise use geolocation
   */
  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");

    if (savedCity) {
      loadWeather(savedCity);
      return;
    }

    // Fallback to browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const data = await fetchWeatherByCoords(
              pos.coords.latitude,
              pos.coords.longitude
            );

            setWeather(data);

            // Save derived location name for consistency
            localStorage.setItem("lastCity", data.locationName);
          } catch (err) {
            setError(err.message);
          }
        },
        () => {
          // silently fail if user denies location
        }
      );
    }
  }, []);

  // Trigger search when user submits input
  const handleSearch = () => {
    if (searchInput.trim()) {
      loadWeather(searchInput.trim());
    }
  };

  // Shorthand references for cleaner JSX
  const w = weather;
  const cur = w ? w.current : null;
  const tod = w ? w.today : null;

  /**
   * Unit labels come from API so UI always matches backend conversions.
   * Defaults prevent crashes before data loads.
   */
  const unitLabels = w
    ? w.unitLabels
    : { temp: "°C", wind: "km/h", dist: "km", precip: "mm" };

  /**
   * Background image is based on:
   * - weather condition (e.g. rain, clear)
   * - time of day (day/night)
   */
  let currentBg = fallbackBg;

  if (cur) {
    const isNight =
      cur.nowHour < cur.sunriseHour ||
      cur.nowHour >= cur.sunsetHour;

    currentBg = getBackgroundImage(cur.condition, isNight);
  }

  /**
   * Extracts selected hourly data points (0, 6, 12, 18, 24)
   * Used for mini charts in metric boxes.
   */
  const getHourlyIntervals = (dataKey) => {
    if (!w || !w.rawHourly) return [];

    return [0, 6, 12, 18, 24].map((hourOffset) =>
      w.rawHourly[hourOffset]
        ? w.rawHourly[hourOffset][dataKey]
        : 0
    );
  };

  return (
    <div
      className="metrics-page"
      style={{ "--metrics-bg": `url(${currentBg})` }} // dynamic background injected into CSS
    >
      <div className="metrics-container">
        <TopBar
          query={searchInput}
          onQueryChange={setSearchInput}
          onSearch={handleSearch}
          tempUnit={tempUnit}
          onTempToggle={handleTempChange}
          distUnit={distUnit}
          onDistToggle={handleDistChange}
        />

        {/* API error display */}
        {error && <div className="metrics-error">{error}</div>}

        {/* Main weather summary */}
        <div className="metrics-weatherbox">
          <WeatherBox
            hourly={w ? w.hourly : []}
            description={cur ? cur.description : ""}
            nowTime={
              cur
                ? cur.nowHour !== undefined
                  ? `${String(Math.floor(cur.nowHour)).padStart(2, "0")}:00`
                  : ""
                : ""
            }
            tempUnit={tempUnit}
          />
        </div>

        {/* Wind + sunrise/sunset section */}
        <div className="metrics-middle-row">
          <WindBox
            windSpeed={cur ? cur.windSpeed : 0}
            windGust={cur ? cur.windGust : 0}
            windDeg={cur ? cur.windDeg : 0}
            windDir={cur ? cur.windDir : "N"}
            nowTime={
              cur ? `${String(Math.floor(cur.nowHour)).padStart(2, "0")}:00` : ""
            }
            unitWind={unitLabels.wind}
          />

          <SunriseSunsetBox
            sunrise={cur ? cur.sunrise : "06:00"}
            sunset={cur ? cur.sunset : "18:00"}
            sunriseHour={cur ? cur.sunriseHour : 6}
            sunsetHour={cur ? cur.sunsetHour : 18}
            nowHour={cur ? cur.nowHour : 12}
          />
        </div>

        {/* Bottom metrics grid */}
        <div className="metrics-bottom-row">
          <UVBox
            uvLabel={cur ? cur.uvLabel : "Low"}
            uvi={cur ? cur.uvi : 0}
            nowTime={
              cur ? `${String(Math.floor(cur.nowHour)).padStart(2, "0")}:00` : ""
            }
            hourlyData={getHourlyIntervals("uvi")}
          />

          <VisibilityBox
            visibility={cur ? cur.visibility : 0}
            nowTime={
              cur ? `${String(Math.floor(cur.nowHour)).padStart(2, "0")}:00` : ""
            }
            unitDist={unitLabels.dist}
            hourlyData={getHourlyIntervals("visibility")}
          />

          <HumidityBox
            humidity={cur ? cur.humidity : 0}
            humidityAvg={
              tod
                ? Math.round(
                    (tod.humidityHigh + tod.humidityLow) / 2
                  )
                : 0
            }
            nowTime={
              cur ? `${String(Math.floor(cur.nowHour)).padStart(2, "0")}:00` : ""
            }
            hourlyData={getHourlyIntervals("humidity")}
          />
        </div>
      </div>
    </div>
  );
}

export default Metrics;