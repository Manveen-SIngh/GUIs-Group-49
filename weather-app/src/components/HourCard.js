import React from "react";
import "./HourCard.css";

function HourCard({ time, icon, temp, rain, wind })
{
  return (
    <div className="hour-card">
      <div className="hour-card__time">{time}</div>

      <img
        src={icon}
        alt="weather icon"
        className="hour-card__icon"
      />

      <div className="hour-card__temp">{temp}°C</div>
      <div className="hour-card__rain">{rain}</div>
      <div className="hour-card__wind">{wind}mph</div>
    </div>
  );
}

export default HourCard;