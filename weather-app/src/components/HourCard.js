// HourCard.js
// One column in the hourly forecast strip. Shows the time, weather icon,
// temperature, rainfall chance, and wind speed + direction for a single hour.
// The parent (HourlyForecast) renders several of these side by side.

import React from "react";
import "./HourCard.css";
import precipitation from "../assets/precipitation.svg";

// Props:
//  time — hour as a 24-hour string
//  icon — import of the weather condition icon image
//  temp — temperature as a number (in whatever unit the parent passes)
//  rain — rainfall string to display, e.g. "30%"
//  wind — wind speed as a number
//  windDeg — wind direction in degrees (0 = north, 90 = east, etc.) for rotating the arrow
//  tempUnit — "C" or "F" 
//  distUnit — "mi" or "km" 
//  windUnit — optional override for the wind label; if provided, distUnit is ignored
function HourCard({ time, icon, temp, rain, wind, windDeg = 0, tempUnit = "C", distUnit = "mi", windUnit = null }) {

  // If the parent already knows the wind unit (e.g. "mph"), use it 
  // Otherwise, work out the label from distUnit 
  const windLabel = windUnit != null ? windUnit : (distUnit === "mi" ? "mph" : "km/h");

  // Convert 24-hour time to 12-hour am/pm format for display.
  // parseInt returns NaN for non-numeric strings like "Now", so handle
  const hour = parseInt(time);
  let newtime;

  if (isNaN(hour)) {
    newtime = time;     
  } else if (hour === 0) {
    newtime = "12am";    
  } else if (hour < 12) {
    newtime = hour + "am";
  } else if (hour === 12) {
    newtime = "12pm";  
  } else {
    newtime = (hour - 12) + "pm"; // subtract 12 to convert from 24-hour to 12-hour
  }

  return (
    <div className="hour-card">

      {/* Time label at the top of the column */}
      <div className="hour-card__time">{newtime}</div>

      {/* Weather condition icon */}
      <img
        src={icon}
        alt="weather icon"
        className="hour-card__icon"
      />

      {/* Temperature rounded to a whole number with the correct unit label */}
      <div className="hour-card__temp">{Math.round(temp)}°{tempUnit}</div>

      {/* Rainfall probability */}
      <div className="hour-card__rain">
        <img
          src={precipitation}
          alt="precipitation"
          className="hour-card__rain-icon"
        />
        <span>{rain}</span>
      </div>

      {/* Wind direction arrow + speed. 
          rotated via inline CSS to point in the actual wind direction.
          windDeg=0 means north (up), windDeg=90 means east (rotated right) */}
      <div className="hour-card__wind-group">
        <div
          className="hour-card__wind-arrow"
          style={{ transform: `rotate(${windDeg}deg)` }}
        >
          ↑
        </div>
        <div className="hour-card__wind">
          {Math.round(wind)}{windLabel}
        </div>
      </div>
    </div>
  );
}

export default HourCard;
