import React, { useState } from "react";
import axios from "axios";

import bg from "./assets/backgrounds/weather-windyNight.svg";
import "./WeatherPage.css";

import WeeklyForecast from "./components/WeeklyForecast";
import TodayCard from "./components/TodayCard";
import SearchBar from "./components/SearchBar";
import HourlyForecast from "./components/HourlyForecast";
import Clock from "./components/Clock";
import menuIcon from "./assets/menu.svg";
import MapCard from "./components/MapCard";
import { useSidebar } from "./Sidebar";

function WeatherPage()
{
  const { open } = useSidebar();
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [error, setError] = useState("");
  const [locationName, setLocationName] = useState("");
  const [coords, setCoords] = useState(null);

  const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;

  const formatDayLabel = (dateString) =>
  {
    const date = new Date(dateString);

    const day = date.toLocaleDateString("en-GB", { weekday: "short" });
    const dayNumber = date.getDate();

    let suffix = "th";

    if (dayNumber === 1 || dayNumber === 21 || dayNumber === 31)
    {
      suffix = "st";
    }
    else if (dayNumber === 2 || dayNumber === 22)
    {
      suffix = "nd";
    }
    else if (dayNumber === 3 || dayNumber === 23)
    {
      suffix = "rd";
    }

    return {
      day,
      date: `${dayNumber}${suffix}`
    };
  };

  // Normalize a OneCall 3.0 hourly item into the same shape that
  // HourlyForecast.js expects (matching the old 2.5 forecast format).
  const normalizeHourlyItem = (item, timezoneOffset) =>
  {
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
        feels_like: item.feels_like
      },
      weather: item.weather,
      wind: { speed: item.wind_speed },
      pop: item.pop || 0
    };
  };

  const buildWeeklyData = (daily, hourlyList, timezoneOffset) =>
  {
    const normalizedHourly = hourlyList.map((h) =>
      normalizeHourlyItem(h, timezoneOffset)
    );

    return daily.slice(0, 6).map((day) =>
    {
      const localMs = (day.dt + timezoneOffset) * 1000;
      const d = new Date(localMs);
      const yy = d.getUTCFullYear();
      const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      const dateKey = `${yy}-${mo}-${dd}`;

      const dayHourly = normalizedHourly.filter((h) =>
        h.dt_txt.slice(0, 10) === dateKey
      );

      const labels = formatDayLabel(dateKey);

      return {
        day: labels.day,
        date: labels.date,
        condition: day.weather[0].main,
        low: Math.round(day.temp.min),
        high: Math.round(day.temp.max),
        humidity: `${day.humidity}%`,
        rain: `${Math.round((day.pop || 0) * 100)}%`,
        wind: `${Math.round(day.wind_speed)}mph`,
        hourly: dayHourly,
        feelsLike: Math.round(day.feels_like.day)
      };
    });
  };

  const loadByCoords = async (lat, lon) => {
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
      if (builtWeeklyData.length > 0) setHourlyData(builtWeeklyData[0].hourly.slice(0, 6));
    } catch (err) {
      setError(err.message);
    }
  };

  // Auto-load on mount using browser geolocation
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadByCoords(pos.coords.latitude, pos.coords.longitude),
        () => {}
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () =>
  {
    try
    {
      setError("");

      // Step 1: Geocode the city name to lat/lon
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}`
      );

      if (!geoResponse.data.length)
      {
        setError("City not found. Please try another name.");
        return;
      }

      const { lat, lon, name } = geoResponse.data[0];

      // Step 2: OneCall 3.0 — true hourly data (48 h) + 8-day daily forecast
      const oneCallResponse = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );

      const { current, hourly, daily, timezone_offset } = oneCallResponse.data;

      const builtWeeklyData = buildWeeklyData(daily, hourly, timezone_offset);

      setLocationName(name);
      setCoords({ lat, lon });
      setWeatherData(current);
      localStorage.setItem("lastCity", query);
      setWeeklyData(builtWeeklyData);
      setSelectedDayIndex(0);

      if (builtWeeklyData.length > 0)
      {
        setHourlyData(builtWeeklyData[0].hourly.slice(0, 6));
      }

      console.log("OneCall 3.0 data:", oneCallResponse.data);
    }
    catch (err)
    {
      console.error(err);
      setError(err.message);
    }
  };

  const handleSelectDay = (index) =>
  {
    setSelectedDayIndex(index);

    if (weeklyData[index])
    {
      setHourlyData(weeklyData[index].hourly.slice(0, 6));
    }
  };

  const selectedDay = weeklyData[selectedDayIndex];

  return (
    <div
      className="weather-page-background"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="weather-page-container">
        <div className="weather-top-bar">
          <div className="top-left">
            <div className="top-button-box">
              <img
                src={menuIcon}
                alt="menuIcon"
                className="weather-page-menu-button"
                onClick={open}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>

          <div className="top-center">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              onSearch={handleSearch}
            />
          </div>

          <div className="top-right">
            <div className="top-time-box">
              <Clock />
            </div>
          </div>
        </div>

        {error && <p>{error}</p>}

        <div className="weather-layout">
          <div className="left-section">
            <WeeklyForecast
              weeklyData={weeklyData}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={handleSelectDay}
              locationName={locationName || "."}
            />
          </div>

          <div className="center-section">
            <div className="center-top-section">
              <TodayCard
                temperature={
                  selectedDay
                    ? selectedDay.high
                    : weatherData
                    ? Math.round(weatherData.temp)
                    : 13
                }
                feelsLike={
                  selectedDay
                  ? selectedDay.feelsLike
                  : weatherData
                    ? Math.round(weatherData.feels_like)
                    : 10
                }
                day={
                  selectedDay
                    ? selectedDayIndex === 0
                    ? "Today"
                    : selectedDay.day + " " + selectedDay.date
                    : weatherData
                    ? weatherData.Date
                    : "Today"
                }
              />
            </div>

            <div className="center-bottom-section">
              <HourlyForecast hourlyData={hourlyData} />
            </div>
          </div>

          <div className="right-section">
            <div className="right-top-section">
              
            </div>
          <div className="right-bottom-section">
            <MapCard
              lat={coords ? coords.lat : 51.5072}
              lon={coords ? coords.lon : -0.1276}
              locationName={locationName || "London"}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default WeatherPage;
