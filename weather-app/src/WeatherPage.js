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

function WeatherPage()
{
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [error, setError] = useState("");

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

  const buildWeeklyData = (forecastList) =>
  {
    const groupedDays = {};

    forecastList.forEach((item) =>
    {
      const dateKey = item.dt_txt.slice(0, 10);

      if (!groupedDays[dateKey])
      {
        groupedDays[dateKey] = [];
      }

      groupedDays[dateKey].push(item);
    });

    const dailyArray = Object.keys(groupedDays).map((dateKey) =>
    {
      const dayItems = groupedDays[dateKey];

      const temps = dayItems.map((item) => item.main.temp);
      const low = Math.min(...temps);
      const high = Math.max(...temps);

      const middayItem =
        dayItems.find((item) => item.dt_txt.includes("12:00:00")) ||
        dayItems[Math.floor(dayItems.length / 2)];

      const labels = formatDayLabel(dateKey);

      return {
        day: labels.day,
        date: labels.date,
        condition: middayItem.weather[0].main,
        low: Math.round(low),
        high: Math.round(high),
        humidity: `${middayItem.main.humidity}%`,
        rain: `${Math.round((middayItem.pop || 0) * 100)}%`,
        wind: `${Math.round(middayItem.wind.speed)}mph`,
        hourly: dayItems,
        feelsLike : Math.round(middayItem.main.feels_like)
      };
    });

    return dailyArray.slice(0, 6);
  };

  const handleSearch = async () =>
  {
    try
    {
      setError("");

      const currentResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&appid=${apiKey}`
      );

      const builtWeeklyData = buildWeeklyData(forecastResponse.data.list);

      setWeatherData(currentResponse.data);
      setWeeklyData(builtWeeklyData);
      setSelectedDayIndex(0);

      if (builtWeeklyData.length > 0)
      {
        setHourlyData(builtWeeklyData[0].hourly.slice(0, 6));
      }

      console.log(currentResponse.data);
      console.log(forecastResponse.data);
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
              locationName={weatherData ? weatherData.name : "."}
            />
          </div>

          <div className="center-section">
            <div className="center-top-section">
              <TodayCard
                temperature={
                  selectedDay
                    ? selectedDay.high
                    : weatherData
                    ? Math.round(weatherData.main.temp)
                    : 13
                }
                feelsLike={
                  selectedDay
                  ?selectedDay.feelsLike
                  : weatherData
                    ? Math.round(weatherData.main.feels_like)
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
              lat={weatherData ? weatherData.coord.lat : 51.5072}
              lon={weatherData ? weatherData.coord.lon : -0.1276}
              locationName={weatherData ? weatherData.name : "London"}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default WeatherPage;