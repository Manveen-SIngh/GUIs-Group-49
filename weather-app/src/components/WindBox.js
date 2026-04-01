import React, { useState, useEffect, useRef } from "react";
import compass from "../assets/Compass.png";
import "./WindBox.css";

/**
 * InfoButton
 *
 * Reusable help button with a popover.
 * Also reports its open/closed state to the parent so the card can raise
 * its stacking order while the popover is visible.
 */
function InfoButton({ title, children, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close the popover when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);

        if (onToggle) {
          onToggle(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onToggle]);

  // Keep local popover state and parent stacking state in sync
  const toggleOpen = () => {
    const newState = !open;
    setOpen(newState);

    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div ref={ref} className="windbox-info">
      <button
        type="button"
        className={`windbox-info-button ${open ? "is-open" : ""}`}
        onClick={toggleOpen}
      >
        i
      </button>

      {open && (
        <div className="windbox-info-popover">
          <h4 className="windbox-info-title">{title}</h4>
          <div className="windbox-info-content">{children}</div>
        </div>
      )}
    </div>
  );
}

export default function WindBox({
  windSpeed = 0,
  windGust = 0,
  windDeg = 0,
  windDir = "N",
  nowTime = "",
  unitWind = "km/h",
}) {
  const [isFront, setIsFront] = useState(false);

  /**
   * Compass artwork is oriented horizontally by default,
   * so the wind bearing is offset by 90 degrees to match the visual.
   */
  const windAngle = windDeg + 90;

  return (
    <div className={`windbox-card ${isFront ? "windbox-card--front" : ""}`}>
      <InfoButton title="Wind Conditions" onToggle={setIsFront}>
        <ul className="windbox-info-list">
          <li>
            <strong>Wind Speed:</strong> The sustained baseline speed of the
            wind currently blowing.
          </li>
          <li>
            <strong>Gusts:</strong> Sudden, brief increases in wind speed.
            Gusts are usually much higher than the sustained speed.
          </li>
          <li>
            <strong>Direction:</strong> The compass direction the wind is
            blowing <em>from</em>. For example, a North ({windDir}) wind blows
            from North to South.
          </li>
        </ul>
      </InfoButton>

      {/* Current timestamp for the reading */}
      <div className="windbox-time">
        {nowTime ? `Now, ${nowTime}` : "Now"}
      </div>

      {/* Text values for speed, gusts, and bearing */}
      <div className="windbox-metrics">
        <div className="windbox-metric-label">Wind</div>
        <div className="windbox-metric-value">
          {windSpeed} {unitWind}
        </div>

        <div className="windbox-metric-label">Gusts</div>
        <div className="windbox-metric-value">
          {windGust} {unitWind}
        </div>

        <div className="windbox-metric-label">Direction</div>
        <div className="windbox-metric-value">
          {String(windDeg).padStart(3, "0")}° {windDir}
        </div>
      </div>

      {/* Compass provides a quick visual for wind direction */}
      <div className="windbox-compass">
        <img
          src={compass}
          alt="compass"
          className="windbox-compass-image"
          style={{ transform: `rotate(${windAngle}deg)` }}
        />

        <div className="windbox-compass-center">
          {windSpeed} {unitWind}
        </div>
      </div>
    </div>
  );
}