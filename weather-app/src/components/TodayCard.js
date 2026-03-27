import React from "react";
import "./TodayCard.css";

function TodayCard({
  temperature = 13,
  unit = "°C",
  feelsLike = 10,
  day = "25th"
})
{
  return (
    <div className="today-card">
      <div className="today-card__title">
        {day}
        </div>

      <div className="today-card__temp">
        {temperature}{unit}
      </div>

      <div className="today-card__feels">
        Feels Like {feelsLike}{unit}
      </div>
    </div>
  );
}

export default TodayCard;