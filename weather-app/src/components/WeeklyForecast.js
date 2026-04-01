// WeeklyForecast.js
// Renders the left-hand column of the dashboard — a list of up to 5 day cards
// showing the forecast for each day. Clicking a card selects that day, which
// updates the hourly / period data shown in the center column.

import React from "react";
import WeeklyDayCard from "./WeeklyDayCard";
import "./WeeklyForecast.css";

// Weather condition icons
import sunny from "../assets/weather-icons/Sunny.svg";
import clouds from "../assets/weather-icons/clouds.svg";
import rainy from "../assets/weather-icons/rainy.svg";
import stormy from "../assets/weather-icons/stormy.svg";
import partlyCloudy from "../assets/weather-icons/sun-clouds.svg";


// getIcon maps the condition string from the API to the correct icon asset.
// Anything that doesn't match a known condition falls back to partly cloudy.
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

  return partlyCloudy; // default 
};

// WeeklyForecast receives the processed 5-day array from WeatherPage and
// renders a WeeklyDayCard for each entry.
//
// Props:
//   weeklyData — array of day objects 
//   selectedDayIndex — which card is currently expanded/active
//   onSelectDay  — callback(index) called when a card is clicked
//   locationName — displayed in the heading at the top of the panel
//   tempUnit — string like "°C" or "°F" passed through to each card
function WeeklyForecast({
  weeklyData = [],
  selectedDayIndex = 0,
  onSelectDay,
  locationName = "Greater London",
  tempUnit = "°C",
})
{
  return (
    <div className="weekly-forecast">
      {/* Heading shows the city name in all caps */}
      <div className="weekly-forecast__title">
        TODAY IN {locationName.toUpperCase()}...
      </div>

      <div className="weekly-forecast__days">
        {/* Show a prompt if no search has been done yet (empty data array) */}
        {weeklyData.length === 0 ? (
          <div className="weekly-forecast__empty">
            Search for a location
          </div>
        ) : (
          // Map each day to a card
          weeklyData.map((day, index) => (
            <WeeklyDayCard
              key={index}
              data={{
                ...day,
                icon: getIcon(day.condition) // attach the icon asset to the data object
              }}
              expanded={index === selectedDayIndex} // only the selected card is expanded
              tempUnit={tempUnit}
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
