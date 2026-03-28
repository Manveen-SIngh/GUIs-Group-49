import React from "react";
import WeeklyDayCard from "./WeeklyDayCard";
import "./WeeklyForecast.css";

import sunny from "../assets/weather-icons/Sunny.svg";
import clouds from "../assets/weather-icons/clouds.svg";
import rainy from "../assets/weather-icons/rainy.svg";
import stormy from "../assets/weather-icons/stormy.svg";
import partlyCloudy from "../assets/weather-icons/sun-clouds.svg";



const getIcon = (condition) =>
{
  if (condition === "Clear")
  {
    return sunny;
  }

  if (condition === "Clouds")
  {
    return clouds;
  }

  if (condition === "Rain" || condition === "Drizzle")
  {
    return rainy;
  }

  if (condition === "Thunderstorm")
  {
    return stormy;
  }

  return partlyCloudy;
};

function WeeklyForecast({
  weeklyData = [],
  selectedDayIndex = 0,
  onSelectDay,
  locationName = "Greater London"
})
{
  return (
    <div className="weekly-forecast">
      <div className="weekly-forecast__title">
        TODAY IN {locationName.toUpperCase()}...
      </div>

      <div className="weekly-forecast__days">
        {weeklyData.length === 0 ? (
          <div className="weekly-forecast__empty">
            Search for a location
          </div>
        ) : (
          weeklyData.map((day, index) => (
            <WeeklyDayCard
              key={index}
              data={{
                ...day,
                icon: getIcon(day.condition)
              }}
              expanded={index === selectedDayIndex}
              onClick={() =>
              {
                if (onSelectDay)
                {
                  onSelectDay(index);
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default WeeklyForecast;