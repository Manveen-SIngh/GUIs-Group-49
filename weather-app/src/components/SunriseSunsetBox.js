import React, { useState, useEffect, useRef } from "react";
import "./SunriseSunsetBox.css";

/**
 * InfoButton
 *
 * Reusable help button with a popover.
 * Reports open state back to the parent so the card can move above nearby cards
 * while the popover is visible.
 */
function InfoButton({ title, children, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close the popover when the user clicks outside the button/panel group
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

  // Keep the parent stacking state aligned with the popover state
  const handleToggle = () => {
    const nextState = !open;
    setOpen(nextState);

    if (onToggle) {
      onToggle(nextState);
    }
  };

  return (
    <div ref={ref} className="sunbox-info">
      <button
        type="button"
        className={`sunbox-info-button ${open ? "is-open" : ""}`}
        onClick={handleToggle}
      >
        i
      </button>

      {open && (
        <div className="sunbox-info-popover">
          <h4 className="sunbox-info-title">{title}</h4>
          <div className="sunbox-info-content">{children}</div>
        </div>
      )}
    </div>
  );
}

export default function SunriseSunsetBox({
  sunrise = "06:07",
  sunset = "18:08",
  sunriseHour = 6 + 7 / 60,
  sunsetHour = 18 + 8 / 60,
  nowHour = 12,
}) {
  const [isFront, setIsFront] = useState(false);

  /**
   * Progress through daylight, from sunrise (0) to sunset (1).
   * The value is clamped so the sun marker stays within the visible path
   * before sunrise and after sunset.
   */
  const progress = (nowHour - sunriseHour) / (sunsetHour - sunriseHour);
  const clamped = Math.max(0, Math.min(1, progress));

  // Geometry for the daylight arc drawn inside the SVG
  const startX = 40;
  const endX = 782;
  const controlX = 411;
  const controlY = -40;

  const horizonY = 80;
  const arcStartY = 105;
  const arcEndY = 105;

  // Interpolate horizontal sun position across the daylight range
  const sunX = startX + (endX - startX) * clamped;

  /**
   * Returns the y position on the quadratic Bézier curve for a given progress t.
   * This is what keeps the sun marker attached to the drawn arc instead of moving
   * in a straight line.
   */
  function quadY(t) {
    return (
      (1 - t) * (1 - t) * arcStartY +
      2 * (1 - t) * t * controlY +
      t * t * arcEndY
    );
  }

  const sunY = quadY(clamped);

  return (
    <div className={`sunbox-card ${isFront ? "sunbox-card--front" : ""}`}>
      <InfoButton title="Daylight Tracker" onToggle={setIsFront}>
        <ul className="sunbox-info-list">
          <li>
            <strong>Sun Path:</strong> The curved arc represents the sun&apos;s
            trajectory across the sky throughout the day.
          </li>
          <li>
            <strong>Current Position:</strong> The yellow dot shows the sun&apos;s
            current estimated position based on the local time.
          </li>
          <li>
            <strong>Horizon:</strong> The straight horizontal line represents the
            ground. When the sun dips below this line, it is nighttime.
          </li>
        </ul>
      </InfoButton>

      {/* Sunrise label on the left side of the card */}
      <div className="sunbox-sunrise">
        Sunrise: {sunrise}
      </div>

      {/* Sunset label on the right side of the card */}
      <div className="sunbox-sunset">
        Sunset: {sunset}
      </div>

      {/* SVG contains the daylight arc, horizon line, and current sun marker */}
      <svg
        className="sunbox-graphic"
        width="100%"
        height="130"
        viewBox="0 0 822 130"
      >
        <path
          d={`M ${startX} ${arcStartY} Q ${controlX} ${controlY} ${endX} ${arcEndY}`}
          className="sunbox-arc"
        />

        <line
          x1="20"
          y1={horizonY}
          x2="802"
          y2={horizonY}
          className="sunbox-horizon"
        />

        <circle
          cx={sunX}
          cy={sunY}
          r="12"
          className="sunbox-sun"
        />
      </svg>
    </div>
  );
}