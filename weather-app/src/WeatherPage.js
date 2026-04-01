// WeatherPage.js
// This is the main page of the app. It handles fetching weather data,
// managing all the state (temperature, hourly, weekly, etc.), and rendering
// the full dashboard layout with all the sub-components.

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Dynamic background helper and fallback
// getBackgroundImage picks an SVG based on weather condition + day/night.
// The other helpers deal with unit conversion and building the data payload.
import { getBackgroundImage, getUnitSettings, convertTemp, convertWind, convertDist, buildWeatherPayload } from "./services/weatherApi";
import fallbackBg from "./assets/backgrounds/weather-partly-cloudy.svg";

import "./WeatherPage.css";

// All the visual widgets that make up the dashboard
import WeeklyForecast from "./components/WeeklyForecast";
import TodayCard from "./components/TodayCard";
import HourlyForecast from "./components/HourlyForecast";
import MapCard from "./components/MapCard";
import TopBar from "./components/TopBar";
import ActivityScoresWidget from "./components/ActivityScoresWidget";
import CustomWidget from "./components/CustomWidget";

function WeatherPage() {
  // ─── State ────────────────────────────────────────────────────────────────
  // query is the text in the search box
  const [query, setQuery] = useState("");

  // tempUnit and distUnit are initialised from localStorage so the user's
  // previously chosen units persist across page refreshes
  const [tempUnit, setTempUnit] = useState(() => {
    const s = getUnitSettings();
    return s.Temperature === "Fahrenheit (F)" ? "F" : "C";
  });
  const [distUnit, setDistUnit] = useState(() => {
    const s = getUnitSettings();
    return s.Distance && s.Distance.includes("mi") ? "mi" : "km";
  });

  // Core weather data from the API
  const [weatherData, setWeatherData] = useState(null);       // current conditions
  const [hourlyData, setHourlyData] = useState([]);           // up to 5 hourly slots for selected day
  const [selectedPeriods, setSelectedPeriods] = useState([]); // morning/afternoon/evening/night for selected day
  const [weeklyData, setWeeklyData] = useState([]);           // 5-day forecast
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);// which day the user clicked on

  const [error, setError] = useState("");        // error message shown if fetch fails
  const [scores, setScores] = useState(null);    // activity scores (cycling, hiking, etc.)
  const [locationName, setLocationName] = useState(""); // city name for display
  const [coords, setCoords] = useState(null);    // lat/lon used for the map card

  // ─── Unit toggle handlers ─────────────────────────────────────────────────
  // When the user switches units in the TopBar, update state and also
  // persist the choice to localStorage so it survives a refresh.

  const handleTempToggle = (unit) => {
    setTempUnit(unit);
    const saved = localStorage.getItem("unitSettings");
    const parsed = saved ? JSON.parse(saved) : {};
    localStorage.setItem("unitSettings", JSON.stringify({
      ...parsed,
      Temperature: unit === "F" ? "Fahrenheit (F)" : "Celsius (C)",
    }));
  };

  const handleDistToggle = (unit) => {
    setDistUnit(unit);
    const saved = localStorage.getItem("unitSettings");
    const parsed = saved ? JSON.parse(saved) : {};
    // Changing distance also changes the wind speed unit (mi -> mph, km -> km/h)
    localStorage.setItem("unitSettings", JSON.stringify({
      ...parsed,
      Distance: unit === "mi" ? "Miles (mi)" : "Kilometers (km)",
      "Wind Speed": unit === "mi" ? "Miles per hour (mph)" : "Kilometers per hour (km/h)",
    }));
  };

  // API key pulled from the .env file — never hard-coded in source
  const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;

  // queryRef lets async callbacks always read the latest query value without
  // needing to add `query` to their dependency arrays (avoids stale closures)
  const queryRef = React.useRef(query);
  useEffect(() => { queryRef.current = query; }, [query]);

  // ─── Helper Functions ──────────────────────────────────────────────────────

  // formatDayLabel turns a "YYYY-MM-DD" string into { day: "Mon", date: "1st" }
  // so each day card can show a friendly label
  const formatDayLabel = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-GB", { weekday: "short" });
    const dayNumber = date.getDate();
    let suffix = "th";

    // Work out the correct ordinal suffix (1st, 2nd, 3rd, 4th...)
    if (dayNumber === 1 || dayNumber === 21 || dayNumber === 31) suffix = "st";
    else if (dayNumber === 2 || dayNumber === 22) suffix = "nd";
    else if (dayNumber === 3 || dayNumber === 23) suffix = "rd";

    return { day, date: `${dayNumber}${suffix}` };
  };

  // normalizeHourlyItem converts a raw OneCall hourly entry into the same
  // shape as a 5-day forecast item so the rest of the app can treat them
  // the same way. We manually build dt_txt using UTC maths + the timezone
  // offset because the API gives us Unix timestamps, not local strings.
  const normalizeHourlyItem = (item, timezoneOffset) => {
    const localMs = (item.dt + timezoneOffset) * 1000;
    const d = new Date(localMs);
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    const yy = d.getUTCFullYear();
    const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");

    return {
      dt_txt: `${yy}-${mo}-${dd} ${hh}:${mm}:00`,
      main: {
        temp: item.temp,
        humidity: item.humidity,
        feels_like: item.feels_like,
      },
      weather: item.weather,
      // Merged: Keep wind speed AND teammate's wind degree
      wind: { speed: item.wind_speed, deg: item.wind_deg ?? 0 },
      pop: item.pop || 0,
    };
  };

  // buildWeeklyData takes the raw daily + hourly arrays from the OneCall
  // response and produces the 5-element array that WeeklyForecast expects.
  // All temps and wind speeds are stored as raw metric values here;
  // conversion to the user's preferred units happens at render time below.
  const buildWeeklyData = useCallback((daily, hourlyList, timezoneOffset) => {
    const normalizedHourly = hourlyList.map((h) => normalizeHourlyItem(h, timezoneOffset));

    return daily.slice(0, 5).map((day) => {
      // Figure out the local date key ("YYYY-MM-DD") for this day so we can
      // match hourly entries to the right day
      const localMs = (day.dt + timezoneOffset) * 1000;
      const d = new Date(localMs);
      const yy = d.getUTCFullYear();
      const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      const dateKey = `${yy}-${mo}-${dd}`;

      // Only keep the hourly entries that belong to this day
      const dayHourly = normalizedHourly.filter((h) => h.dt_txt.slice(0, 10) === dateKey);
      const labels = formatDayLabel(dateKey);
      const rainStr = `${Math.round((day.pop || 0) * 100)}%`;
      const windRaw = day.wind_speed; // raw m/s, converted at render time

      return {
        day: labels.day,
        date: labels.date,
        condition: day.weather[0].main,
        low: Math.round(day.temp.min),    // raw °C, converted at render time
        high: Math.round(day.temp.max),   // raw °C, converted at render time
        humidity: `${day.humidity}%`,
        rain: rainStr,
        windRaw,
        hourly: dayHourly,
        feelsLike: Math.round(day.feels_like.day), // raw °C
        // Merged: Keep time periods AND teammate's windDeg
        // These four periods (morning/afternoon/evening/night) are shown when
        // there's no hourly data available for that day (days 3–5)
        periods: [
          { label: "Morning",   temp: Math.round(day.temp.morn),  condition: day.weather[0].main, rain: rainStr, wind: windRaw, windDeg: day.wind_deg ?? 0 },
          { label: "Afternoon", temp: Math.round(day.temp.day),   condition: day.weather[0].main, rain: rainStr, wind: windRaw, windDeg: day.wind_deg ?? 0 },
          { label: "Evening",   temp: Math.round(day.temp.eve),   condition: day.weather[0].main, rain: rainStr, wind: windRaw, windDeg: day.wind_deg ?? 0 },
          { label: "Night",     temp: Math.round(day.temp.night), condition: day.weather[0].main, rain: rainStr, wind: windRaw, windDeg: day.wind_deg ?? 0 },
        ],
      };
    });
  }, []);

  // ─── Weather Loading Logic ──────────────────────────────────────────────────

  // handleSearch is called when the user submits a city name.
  // It first geocodes the city to get lat/lon, then hits the OneCall endpoint.
  // overrideQuery lets us call this from the startup effect with a saved city
  // name without having to wait for the query state to update.
  const handleSearch = useCallback(async (overrideQuery) => {
    const searchTerm = overrideQuery !== undefined ? overrideQuery : queryRef.current;
    if (!searchTerm) return;
    try {
      setError("");
      //convert city name -> coordinates
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchTerm)}&limit=1&appid=${apiKey}`
      );
      if (!geoResponse.data.length) {
        setError("City not found.");
        return;
      }
      const { lat, lon, name } = geoResponse.data[0];

      //get full weather data (current + hourly + daily) for those coords
      const oneCallResponse = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      const { current, hourly, daily, timezone_offset } = oneCallResponse.data;
      const builtWeeklyData = buildWeeklyData(daily, hourly, timezone_offset);

      // buildWeatherPayload also calculates activity scores
      const payload = buildWeatherPayload(lat, lon, name, oneCallResponse.data);

      setLocationName(name);
      setCoords({ lat, lon });
      setWeatherData(current);
      // Remember the last searched city so we can reload it on next visit
      localStorage.setItem("lastCity", searchTerm);
      setWeeklyData(builtWeeklyData);
      setSelectedDayIndex(0);
      setScores(payload.scores);

      // Pre-populate hourly / period slots for today (index 0)
      if (builtWeeklyData.length > 0) {
        setHourlyData(builtWeeklyData[0].hourly.slice(0, 5));
        setSelectedPeriods(builtWeeklyData[0].periods || []);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [apiKey, buildWeeklyData]);

  // loadByCoords is used for the browser geolocation path — when there's no
  // saved city we ask the browser for the device's current position instead.
  //run the reverse-geocode and OneCall requests in parallel for increased speed
  const loadByCoords = useCallback(async (lat, lon) => {
    try {
      setError("");
      const [geoRes, oneCallRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`),
        axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
      ]);
      const name = geoRes.data.length ? geoRes.data[0].name : "Your Location";
      const { current, hourly, daily, timezone_offset } = oneCallRes.data;
      const builtWeeklyData = buildWeeklyData(daily, hourly, timezone_offset);
      const payload = buildWeatherPayload(lat, lon, name, oneCallRes.data);

      setLocationName(name);
      setCoords({ lat, lon });
      setWeatherData(current);
      setWeeklyData(builtWeeklyData);
      setSelectedDayIndex(0);
      setScores(payload.scores);
      if (builtWeeklyData.length > 0) {
        setHourlyData(builtWeeklyData[0].hourly.slice(0, 5));
        setSelectedPeriods(builtWeeklyData[0].periods || []);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [apiKey, buildWeeklyData]);

  // try to restore the last searched city from localStorage
  // If nothing is saved, fall back to the browser's geolocation API
  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      setQuery(savedCity);
      handleSearch(savedCity);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadByCoords(pos.coords.latitude, pos.coords.longitude),
        () => {} // silently ignore if the user denies location permission
      );
    }
  }, [handleSearch, loadByCoords]);

  // handleSelectDay is called when the user clicks a day in the WeeklyForecast
  // It swaps out the hourly / period data shown in the center column
  const handleSelectDay = (index) => {
    setSelectedDayIndex(index);
    if (weeklyData[index]) {
      setHourlyData(weeklyData[index].hourly.slice(0, 5));
      setSelectedPeriods(weeklyData[index].periods || []);
    }
  };


  // For Rendering  
  // Pick background image based on current weather condition and
  // whether it's currently day or night at the searched location
  let currentBg = fallbackBg;
  if (weatherData) {
    const isNight = weatherData.dt < weatherData.sunrise || weatherData.dt >= weatherData.sunset;
    currentBg = getBackgroundImage(weatherData.weather[0].main, isNight);
  }

  // Convert a numeric UV index into a readable label for the widget
  const uvLabel = (uvi) => {
    if (uvi == null) return "—";
    if (uvi <= 2) return "Low";
    if (uvi <= 5) return "Moderate";
    if (uvi <= 7) return "High";
    if (uvi <= 10) return "Very High";
    return "Extreme";
  };

  // Getting Unit settings from settings menu
  // read current settings fresh at render time so any toggle changes
  // are immediately reflected in labels and converted values below
  const unitSettings = getUnitSettings();
  const tempLabel = unitSettings.Temperature === "Fahrenheit (F)" ? "°F" : "°C";
  const tempUnitStr = unitSettings.Temperature === "Fahrenheit (F)" ? "F" : "C";
  const windLabel = unitSettings["Wind Speed"] === "Miles per hour (mph)" ? "mph"
    : unitSettings["Wind Speed"] === "Meters per second (m/s)" ? "m/s"
    : unitSettings["Wind Speed"] === "Knots (kn)" ? "kn" : "km/h";
  const distLabel = unitSettings.Distance === "Miles (mi)" ? "mi"
    : unitSettings.Distance === "Meters (m)" ? "m" : "km";

  // Convert weekly data at render time
  // stored raw metric values in state so we can re-convert whenever the
  // user changes units without needing to re-fetch from the API
  const convertedWeeklyData = weeklyData.map(d => ({
    ...d,
    low: Math.round(convertTemp(d.low, unitSettings.Temperature)),
    high: Math.round(convertTemp(d.high, unitSettings.Temperature)),
    wind: `${Math.round(convertWind(d.windRaw, unitSettings["Wind Speed"]))} ${windLabel}`,
    feelsLike: Math.round(convertTemp(d.feelsLike, unitSettings.Temperature)),
  }));

  // Convert hourly data at render time
  const convertedHourlyData = hourlyData.map(h => ({
    ...h,
    main: { ...h.main, temp: convertTemp(h.main.temp, unitSettings.Temperature) },
    wind: { ...h.wind, speed: convertWind(h.wind.speed, unitSettings["Wind Speed"]) },
  }));

  // Convert period data at render time
  const convertedPeriods = selectedPeriods.map(p => ({
    ...p,
    temp: Math.round(convertTemp(p.temp, unitSettings.Temperature)),
    wind: Math.round(convertWind(p.wind, unitSettings["Wind Speed"])),
  }));

  // For today (index 0) we use the live current temp; for other days we use
  // the daily high as a representative temperature for TodayCard
  const todayTemp = selectedDayIndex === 0 && weatherData
    ? Math.round(convertTemp(weatherData.temp, unitSettings.Temperature))
    : (convertedWeeklyData[selectedDayIndex]?.high || 0);

  const todayFeelsLike = selectedDayIndex === 0 && weatherData
    ? Math.round(convertTemp(weatherData.feels_like, unitSettings.Temperature))
    : (convertedWeeklyData[selectedDayIndex]?.feelsLike || 0);

  // widgetValues holds the data passed to the two CustomWidget slots
  // Each value is a pre-formatted string so the widget just has to display it
  const widgetValues = {
    wind: weatherData ? `${Math.round(convertWind(weatherData.wind_speed, unitSettings["Wind Speed"]))} ${windLabel}` : "—",
    humidity: weatherData ? `${weatherData.humidity}%` : "—",
    rain: weeklyData[selectedDayIndex]?.rain || "—",
    uv: weatherData ? uvLabel(weatherData.uvi) : "—",
    visibility: weatherData ? `${convertDist(weatherData.visibility, unitSettings.Distance).toFixed(1)} ${distLabel}` : "—",
  };

  // The outermost div sets the full-screen background image.
  // Inside we have a fixed-width container with a three-column grid:
  //   left  — WeeklyForecast
  //   center — TodayCard + HourlyForecast + two CustomWidgets
  //   right  — ActivityScoresWidget + MapCard
  return (
    <div
      className="weather-page-background"
      style={{ backgroundImage: `url(${currentBg})`, transition: "background-image 0.5s ease-in-out" }}
    >
      <div className="weather-page-container">
        {/* TopBar holds search input, logo/menu, and unit toggles */}
        <TopBar
          query={query}
          onQueryChange={setQuery}
          onSearch={() => handleSearch()}
          tempUnit={tempUnit}
          onTempToggle={handleTempToggle}
          distUnit={distUnit}
          onDistToggle={handleDistToggle}
        />

        {/* Only rendered if the API call returned an error */}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div className="weather-layout">
          {/* Left column: 5-day weekly forecast list */}
          <div className="left-section">
            <WeeklyForecast weeklyData={convertedWeeklyData} selectedDayIndex={selectedDayIndex} onSelectDay={handleSelectDay} locationName={locationName || "."} tempUnit={tempLabel} />
          </div>

          {/* Center column: big temp display, hourly row, two customisable widgets */}
          <div className="center-section">
            <div className="center-top-section">
              <TodayCard
                temperature={todayTemp}
                unit={tempLabel}
                feelsLike={todayFeelsLike}
                // Show "Today" for the current day, or the day + date for future days
                day={selectedDayIndex === 0 ? "Today" : `${weeklyData[selectedDayIndex]?.day} ${weeklyData[selectedDayIndex]?.date}`}
              />
            </div>
            <div className="center-bottom-section">
              <HourlyForecast hourlyData={convertedHourlyData} periods={convertedPeriods} tempUnit={tempUnitStr} windUnit={windLabel} />
            </div>
            {/* Two side-by-side customisable stat widgets */}
            <div className="center-widgets-row">
              <CustomWidget values={widgetValues} />
              <CustomWidget values={widgetValues} />
            </div>
          </div>

          {/* Right column: activity scores + map */}
          <div className="right-section">
            <div className="right-top-section"><ActivityScoresWidget scores={scores} /></div>
            <div className="right-bottom-section">
              {/* Default to London coords if no search has been done yet */}
              <MapCard lat={coords ? coords.lat : 51.5072} lon={coords ? coords.lon : -0.1276} locationName={locationName || "London"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;
