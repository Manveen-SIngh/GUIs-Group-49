import React from "react";
import HourCard from "./HourCard";
import "./HourlyForecast.css";

import sunny from "../assets/weather-icons/Sunny.svg";
import clouds from "../assets/weather-icons/clouds.svg";
import rainy from "../assets/weather-icons/rainy.svg";
import stormy from "../assets/weather-icons/stormy.svg";
import partlyCloudy from "../assets/weather-icons/sun-clouds.svg";
import night from "../assets/weather-icons/night.svg";
import cloudyNight from "../assets/weather-icons/cloudyNight.svg";
import rainyNight from "../assets/weather-icons/rainyNight.svg";

const getIcon = (condition, isNight = false) =>
{
  if (isNight)
  {
    if (condition === "Clear") return night;
    if (condition === "Clouds") return cloudyNight;
    if (condition === "Rain" || condition === "Drizzle") return rainyNight;
    if (condition === "Thunderstorm") return stormy;
    return cloudyNight;
  }
  if (condition === "Clear") return sunny;
  if (condition === "Clouds") return clouds;
  if (condition === "Rain" || condition === "Drizzle") return rainy;
  if (condition === "Thunderstorm") return stormy;
  return partlyCloudy;
};

const isNightHour = (hour) => hour < 6 || hour >= 20;

const formatTime = (dt_txt) => dt_txt.slice(11, 16);

function HourlyForecast({ hourlyData, periods = [], tempUnit = "C", windUnit = null })
{
  // Days 3–8 have no hourly data — show morning/afternoon/evening/night instead
  if (hourlyData.length === 0 && periods.length > 0)
  {
    return (
      <div className="hourly-forecast">
        {periods.map((p) => (
          <HourCard
            key={p.label}
            time={p.label}
            icon={getIcon(p.condition, p.label === "Night")}
            temp={p.temp}
            rain={p.rain}
            wind={p.wind}
            windDeg={p.windDeg ?? 0}
            tempUnit={tempUnit}
            windUnit={windUnit}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="hourly-forecast">
      {hourlyData.map((hour, index) => {
        const timeStr = formatTime(hour.dt_txt);
        const hourNum = parseInt(timeStr.slice(0, 2));
        return (
          <HourCard
            key={index}
            time={timeStr}
            icon={getIcon(hour.weather[0].main, isNightHour(hourNum))}
            temp={Math.round(hour.main.temp)}
            rain={`${Math.round(hour.pop * 100)}%`}
            wind={Math.round(hour.wind.speed)}
            windDeg={hour.wind.deg ?? 0}
            tempUnit={tempUnit}
            windUnit={windUnit}
          />
        );
      })}
    </div>
  );
}

export default HourlyForecast;
