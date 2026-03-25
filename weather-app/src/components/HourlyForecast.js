import React from "react";
import HourCard from "./HourCard";
import "./HourlyForecast.css";

import sunny from "../assets/weather-icons/Sunny.svg";
import clouds from "../assets/weather-icons/clouds.svg";
import rainy from "../assets/weather-icons/rainy.svg";
import stormy from "../assets/weather-icons/stormy.svg";
import partlyCloudy from "../assets/weather-icons/sun-clouds.svg";

const getIcon = (condition) =>
{
  if (condition === "Clear") return sunny;
  if (condition === "Clouds") return clouds;
  if (condition === "Rain") return rainy;
  if (condition === "Thunderstorm") return stormy;
  return partlyCloudy;
};

// 🔹 dt_txt → "12:00"
const formatTime = (dt_txt) =>
{
  return dt_txt.slice(11, 16);
};

function HourlyForecast({ hourlyData })
{
  return (
    <div className="hourly-forecast">
      {hourlyData.map((hour, index) => (
        <HourCard
          key={index}
          time={formatTime(hour.dt_txt)}
          icon={getIcon(hour.weather[0].main)}
          temp={Math.round(hour.main.temp)}
          rain={`${Math.round(hour.pop * 100)}%`}
          wind={Math.round(hour.wind.speed)}
        />
      ))}
    </div>
  );
}

export default HourlyForecast;