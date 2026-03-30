import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Dynamic background helper and fallback
import { getBackgroundImage } from "./services/weatherApi";
import fallbackBg from "./assets/backgrounds/weather-partly-cloudy.svg";

import "./WeatherPage.css";

import WeeklyForecast from "./components/WeeklyForecast";
import TodayCard from "./components/TodayCard";
import SearchBar from "./components/SearchBar";
import HourlyForecast from "./components/HourlyForecast";
import Clock from "./components/Clock";
import menuIcon from "./assets/menu.svg";
import MapCard from "./components/MapCard";
import { useSidebar } from "./Sidebar";
import ActivityScoresWidget from "./components/ActivityScoresWidget";
import CustomWidget from "./components/CustomWidget";

function WeatherPage() {
  const { open } = useSidebar();
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [error, setError] = useState("");
  const [locationName, setLocationName] = useState("");
  const [coords, setCoords] = useState(null);

  const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;

  // ─── restored helper functions ─────────────────────────────────────────────

  const formatDayLabel = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-GB", { weekday: "short" });
    const dayNumber = date.getDate();
    let suffix = "th";

    if (dayNumber === 1 || dayNumber === 21 || dayNumber === 31) suffix = "st";
    else if (dayNumber === 2 || dayNumber === 22) suffix = "nd";
    else if (dayNumber === 3 || dayNumber === 23) suffix = "rd";

    return { day, date: `${dayNumber}${suffix}` };
  };

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
      wind: { speed: item.wind_speed },
      pop: item.pop || 0,
    };
  };

  const buildWeeklyData = useCallback((daily, hourlyList, timezoneOffset) => {
    const normalizedHourly = hourlyList.map((h) => normalizeHourlyItem(h, timezoneOffset));

    return daily.slice(0, 6).map((day) => {
      const localMs = (day.dt + timezoneOffset) * 1000;
      const d = new Date(localMs);
      const yy = d.getUTCFullYear();
      const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      const dateKey = `${yy}-${mo}-${dd}`;

      const dayHourly = normalizedHourly.filter((h) => h.dt_txt.slice(0, 10) === dateKey);
      const labels = formatDayLabel(dateKey);
      const rainStr = `${Math.round((day.pop || 0) * 100)}%`;
      const windNum = Math.round(day.wind_speed);

      return {
        day: labels.day,
        date: labels.date,
        condition: day.weather[0].main,
        low: Math.round(day.temp.min),
        high: Math.round(day.temp.max),
        humidity: `${day.humidity}%`,
        rain: rainStr,
        wind: `${windNum}mph`,
        hourly: dayHourly,
        feelsLike: Math.round(day.feels_like.day),
        periods: [
          { label: "Morning", temp: Math.round(day.temp.morn), condition: day.weather[0].main, rain: rainStr, wind: windNum },
          { label: "Afternoon", temp: Math.round(day.temp.day), condition: day.weather[0].main, rain: rainStr, wind: windNum },
          { label: "Evening", temp: Math.round(day.temp.eve), condition: day.weather[0].main, rain: rainStr, wind: windNum },
          { label: "Night", temp: Math.round(day.temp.night), condition: day.weather[0].main, rain: rainStr, wind: windNum },
        ],
      };
    });
  }, []);

  // ─── Weather Loading Logic ──────────────────────────────────────────────────

  const handleSearch = useCallback(async (overrideQuery) => {
    const searchTerm = overrideQuery || query;
    if (!searchTerm) return;
    try {
      setError("");
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchTerm)}&limit=1&appid=${apiKey}`
      );
      if (!geoResponse.data.length) {
        setError("City not found.");
        return;
      }
      const { lat, lon, name } = geoResponse.data[0];
      const oneCallResponse = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      const { current, hourly, daily, timezone_offset } = oneCallResponse.data;
      const builtWeeklyData = buildWeeklyData(daily, hourly, timezone_offset);

      setLocationName(name);
      setCoords({ lat, lon });
      setWeatherData(current);
      localStorage.setItem("lastCity", searchTerm);
      setWeeklyData(builtWeeklyData);
      setSelectedDayIndex(0);

      if (builtWeeklyData.length > 0) {
        setHourlyData(builtWeeklyData[0].hourly.slice(0, 6));
        setSelectedPeriods(builtWeeklyData[0].periods || []);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [query, apiKey, buildWeeklyData]);

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
      
      setLocationName(name);
      setCoords({ lat, lon });
      setWeatherData(current);
      setWeeklyData(builtWeeklyData);
      setSelectedDayIndex(0);
      if (builtWeeklyData.length > 0) {
        setHourlyData(builtWeeklyData[0].hourly.slice(0, 6));
        setSelectedPeriods(builtWeeklyData[0].periods || []);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [apiKey, buildWeeklyData]);

  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      setQuery(savedCity);
      handleSearch(savedCity);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadByCoords(pos.coords.latitude, pos.coords.longitude),
        () => {}
      );
    }
  }, [handleSearch, loadByCoords]);

  const handleSelectDay = (index) => {
    setSelectedDayIndex(index);
    if (weeklyData[index]) {
      setHourlyData(weeklyData[index].hourly.slice(0, 6));
      setSelectedPeriods(weeklyData[index].periods || []);
    }
  };

  // Dynamic Background
  let currentBg = fallbackBg;
  if (weatherData) {
    const isNight = weatherData.dt < weatherData.sunrise || weatherData.dt >= weatherData.sunset;
    currentBg = getBackgroundImage(weatherData.weather[0].main, isNight);
  }

  const uvLabel = (uvi) => {
    if (uvi == null) return "—";
    if (uvi <= 2) return "Low";
    if (uvi <= 5) return "Moderate";
    if (uvi <= 7) return "High";
    if (uvi <= 10) return "Very High";
    return "Extreme";
  };

  const widgetValues = {
    wind: weatherData ? `${Math.round(weatherData.wind_speed * 3.6)} km/h` : "—",
    humidity: weatherData ? `${weatherData.humidity}%` : "—",
    rain: weeklyData[selectedDayIndex]?.rain || "—",
    uv: weatherData ? uvLabel(weatherData.uvi) : "—",
    visibility: weatherData ? `${(weatherData.visibility / 1000).toFixed(1)} km` : "—",
  };

  return (
    <div
      className="weather-page-background"
      style={{ backgroundImage: `url(${currentBg})`, transition: "background-image 0.5s ease-in-out" }}
    >
      <div className="weather-page-container">
        <div className="weather-top-bar">
          <div className="top-left">
            <div className="top-button-box">
              <img src={menuIcon} alt="Menu" className="weather-page-menu-button" onClick={open} style={{ cursor: 'pointer' }} />
            </div>
          </div>
          <div className="top-center">
            <SearchBar query={query} onQueryChange={setQuery} onSearch={() => handleSearch()} />
          </div>
          <div className="top-right"><div className="top-time-box"><Clock /></div></div>
        </div>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div className="weather-layout">
          <div className="left-section">
            <WeeklyForecast weeklyData={weeklyData} selectedDayIndex={selectedDayIndex} onSelectDay={handleSelectDay} locationName={locationName || "."} />
          </div>

          <div className="center-section">
            <div className="center-top-section">
              <TodayCard
                temperature={selectedDayIndex === 0 && weatherData ? Math.round(weatherData.temp) : weeklyData[selectedDayIndex]?.high || 0}
                feelsLike={selectedDayIndex === 0 && weatherData ? Math.round(weatherData.feels_like) : weeklyData[selectedDayIndex]?.feelsLike || 0}
                day={selectedDayIndex === 0 ? "Today" : `${weeklyData[selectedDayIndex]?.day} ${weeklyData[selectedDayIndex]?.date}`}
              />
            </div>
            <div className="center-bottom-section">
              <HourlyForecast hourlyData={hourlyData} periods={selectedPeriods} />
            </div>
            <div className="center-widgets-row">
              <CustomWidget values={widgetValues} />
              <CustomWidget values={widgetValues} />
            </div>
          </div>

          <div className="right-section">
            <div className="right-top-section"><ActivityScoresWidget /></div>
            <div className="right-bottom-section">
              <MapCard lat={coords ? coords.lat : 51.5072} lon={coords ? coords.lon : -0.1276} locationName={locationName || "London"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;