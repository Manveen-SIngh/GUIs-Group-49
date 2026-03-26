import React from "react";
import "./HourCard.css";
import precipitation from "../assets/precipitation.svg";

function HourCard({ time, icon, temp, rain, wind })
{

  const hour = parseInt(time);

  let newtime;

  if (hour === 0)
  {
    newtime = "12am";
  }
  else if (hour < 12)
  {
    newtime = hour + "am";
  }
  else if (hour === 12)
  {
    newtime = "12pm";
  }
  else
  {
    newtime = (hour - 12) + "pm";
  }
  
  return (
    <div className="hour-card">
      
      <div className="hour-card__time">{newtime}</div>

      <img
        src={icon}
        alt="weather icon"
        className="hour-card__icon"
      />

      <div className="hour-card__temp">{temp}°C</div>

      <div className="hour-card__rain">
        <img
          src={precipitation}
          alt="precipitation"
          className="hour-card__rain-icon"
        />
        <span>{rain}</span>
      </div>

      <div className="hour-card__wind">{wind}mph</div>
    </div>
  );
}

export default HourCard;