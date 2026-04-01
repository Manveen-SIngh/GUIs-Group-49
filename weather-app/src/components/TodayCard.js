// TodayCard.js
// A simple display card shown in the centre of the dashboard.
// It shows the selected day's label, the main temperature, and the
// "feels like" temperature underneath. It has no logic of its own —
// all values are passed in as props from WeatherPage.

import React from "react";
import "./TodayCard.css";

// Props:
//   temperature — numeric temperature value (already converted to the user's unit)
//   unit — display string like "°C" or "°F
//   feelsLike — numeric feels-like value
//   day  — string label, either "Today" or something like "Mon 7th"
function TodayCard({
  // default values
  temperature = 13,
  unit = "°C",
  feelsLike = 10,
  day = "25th"
})
{
  return (
    <div className="today-card">
      {/* Day label at the top — "Today" for the current day, or day + date for future */}
      <div className="today-card__title">
        {day}
        </div>

      {/* Main temperature display — large font set in CSS */}
      <div className="today-card__temp">
        {temperature}{unit}
      </div>

      {/* Feels-like temperature shown in smaller text below the main temp */}
      <div className="today-card__feels">
        Feels Like {feelsLike}{unit}
      </div>
    </div>
  );
}

export default TodayCard;
