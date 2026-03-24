import React from "react";
import "./TodayCard.css";

function TodayCard({
  temperature = 13,
  unit = "°C",
  feelsLike = 10
})
{
  return (
    <div className="today-card">
      <div className="today-card__title">TODAY</div>

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