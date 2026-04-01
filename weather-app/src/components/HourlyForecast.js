// HourlyForecast.js
// Renders a horizontal row of HourCard components showing either:
//   - Actual hourly slots (today and the next couple of days which have
//     real hourly data from the OneCall API), or
//   - Four time-of-day period slots (Morning / Afternoon / Evening / Night)
//     for days further out that don't have per-hour data.

// The component decides which mode to use based on whether hourlyData is empty.

import React from "react";
import HourCard from "./HourCard";
import "./HourlyForecast.css";

// Day and night icon variants so we can show the right icon for each hour
import sunny from "../assets/weather-icons/Sunny.svg";
import clouds from "../assets/weather-icons/clouds.svg";
import rainy from "../assets/weather-icons/rainy.svg";
import stormy from "../assets/weather-icons/stormy.svg";
import partlyCloudy from "../assets/weather-icons/sun-clouds.svg";
import night from "../assets/weather-icons/night.svg";
import cloudyNight from "../assets/weather-icons/cloudyNight.svg";
import rainyNight from "../assets/weather-icons/rainyNight.svg";

// getIcon picks the right icon based on the condition string and whether it's
// currently night-time at that hour. Night icons use separate assets.
const getIcon = (condition, isNight = false) =>
{
  if (isNight)
  {
    if (condition === "Clear") return night;
    if (condition === "Clouds") return cloudyNight;
    if (condition === "Rain" || condition === "Drizzle") return rainyNight;
    if (condition === "Thunderstorm") return stormy; // same stormy icon for both day/night
    return cloudyNight; // default night 
  }
  // Daytime icons
  if (condition === "Clear") return sunny;
  if (condition === "Clouds") return clouds;
  if (condition === "Rain" || condition === "Drizzle") return rainy;
  if (condition === "Thunderstorm") return stormy;
  return partlyCloudy; // default day
};

// isNightHour decides whether a given hour number (0–23) counts as night.
// treat 6am–8pm as daytime and everything else as night
const isNightHour = (hour) => hour < 6 || hour >= 20;

// formatTime extracts "HH:MM" from a dt_txt string
const formatTime = (dt_txt) => dt_txt.slice(11, 16);

// Props:
//   hourlyData — array of normalised hourly objects (empty for days 3–5)
//   periods — array of { label, condition, temp, rain, wind, windDeg } for the four time slots
//   tempUnit — "C" or "F" (letter only, no °), passed through to HourCard
//   windUnit — display string like "km/h" or "mph", passed through to HourCard
function HourlyForecast({ hourlyData, periods = [], tempUnit = "C", windUnit = null })
{
  // Days 3–8 have no hourly data — show morning/afternoon/evening/night instead
  // If hourlyData is empty but we have period data, switch to period mode.
  if (hourlyData.length === 0 && periods.length > 0)
  {
    return (
      <div className="hourly-forecast">
        {periods.map((p) => (
          <HourCard
            key={p.label}
            time={p.label}           // e.g. "Morning", "Afternoon"
            icon={getIcon(p.condition, p.label === "Night")} // night icon only for the Night period
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

  // Normal mode: render one HourCard per hourly entry
  return (
    <div className="hourly-forecast">
      {hourlyData.map((hour, index) => {
        const timeStr = formatTime(hour.dt_txt);
        const hourNum = parseInt(timeStr.slice(0, 2)); // extract the hour as a number
        return (
          <HourCard
            key={index}
            time={timeStr}
            icon={getIcon(hour.weather[0].main, isNightHour(hourNum))}
            temp={Math.round(hour.main.temp)}
            rain={`${Math.round(hour.pop * 100)}%`} // convert 0–1 fraction to percentage string
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
