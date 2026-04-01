import React, { useState, useEffect, useRef } from "react";
import "./WeatherBox.css";

import sunnyIcon from "../assets/weather-icons/Sunny.svg";
import cloudsIcon from "../assets/weather-icons/clouds.svg";
import rainyIcon from "../assets/weather-icons/rainy.svg";
import stormyIcon from "../assets/weather-icons/stormy.svg";
import windyIcon from "../assets/weather-icons/windy.svg";
import partlyIcon from "../assets/weather-icons/sun-clouds.svg";
import nightIcon from "../assets/weather-icons/night.svg";
import cloudyNight from "../assets/weather-icons/cloudyNight.svg";
import rainyNight from "../assets/weather-icons/rainyNight.svg";

import precipitationIcon from "../assets/precipitation.svg";

/**
 * Small help button that opens a forecast explanation popover.
 * Closes automatically when the user clicks outside of it.
 */
function InfoButton({ title, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="weatherbox-info">
      <button
        type="button"
        className={`weatherbox-info-button ${open ? "is-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        i
      </button>

      {open && (
        <div className="weatherbox-info-popover">
          <h4 className="weatherbox-info-title">{title}</h4>
          <div className="weatherbox-info-content">{children}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Treats early morning and late evening hours as night mode
 * so the correct icon set can be used.
 */
const isNightHour = (timeStr) => {
  if (!timeStr) return false;

  const hour = parseInt(timeStr.slice(0, 2), 10);
  return hour < 6 || hour >= 20;
};

/**
 * Maps weather conditions to the matching icon.
 * Night icons are used when the supplied time falls in night hours.
 */
const getConditionIcon = (condition, isNight = false) => {
  if (isNight) {
    if (condition === "Clear") return nightIcon;
    if (condition === "Clouds") return cloudyNight;
    if (condition === "Rain" || condition === "Drizzle") return rainyNight;
    if (condition === "Thunderstorm") return stormyIcon;
    return cloudyNight;
  }

  if (condition === "Clear") return sunnyIcon;
  if (condition === "Clouds") return cloudsIcon;
  if (condition === "Rain" || condition === "Drizzle") return rainyIcon;
  if (condition === "Thunderstorm") return stormyIcon;
  if (condition === "Wind") return windyIcon;
  return partlyIcon;
};

function WeatherIcon({ condition, time }) {
  return (
    <img
      src={getConditionIcon(condition, time ? isNightHour(time) : false)}
      alt={condition || "weather"}
      className="weatherbox-icon"
    />
  );
}

function RainIndicator({ rainString }) {
  if (!rainString) return null;

  return (
    <div className="weatherbox-rain">
      <img
        src={precipitationIcon}
        alt="precipitation"
        className="weatherbox-rain-icon"
      />
      <span className="weatherbox-rain-text">{rainString}</span>
    </div>
  );
}

/**
 * Single hourly forecast block.
 * Shows time, icon, condition, temperature, and precipitation chance.
 */
function HourBlock({ hour, tempUnit }) {
  return (
    <div className="weatherbox-hour">
      <div className="weatherbox-hour-time">{hour.time}</div>

      <WeatherIcon condition={hour.condition} time={hour.time} />

      <div className="weatherbox-hour-condition">{hour.condition}</div>

      <div className="weatherbox-hour-temp">
        {hour.temp}°{tempUnit}
      </div>

      <RainIndicator rainString={hour.rain} />
    </div>
  );
}

export default function WeatherBox({
  hourly = [],
  description = "",
  nowTime = "",
  tempUnit = "C",
}) {
  return (
    <div className="weatherbox-shell">
      <div className="weatherbox-card">
        <InfoButton title="Hourly Forecast Guide">
          <p className="weatherbox-info-paragraph">
            This panel shows the expected weather conditions for the next 12
            hours.
          </p>

          <ul className="weatherbox-info-list">
            <li>
              <strong>Condition:</strong> The general state of the weather
              (e.g., Rain, Clear) accompanied by an icon.
            </li>
            <li>
              <strong>Temperature:</strong> The forecasted air temperature for
              that specific hour.
            </li>
            <li>
              <strong>Precipitation (%):</strong> The probability that rain or
              snow will occur in your area during this hour.
            </li>
          </ul>
        </InfoButton>

        <div className="weatherbox-header">
          {nowTime ? `Now, ${nowTime}` : "Now"}
          <br />
          {description || "Hourly forecast"}
        </div>

        <div className="weatherbox-grid">
          {hourly.map((hour, i) => (
            <div key={hour.time || i} className="weatherbox-hour-wrap">
              <HourBlock hour={hour} tempUnit={tempUnit} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}