import React, { useState, useEffect, useRef } from "react";
import "./VisibilityBox.css";

/**
 * InfoButton
 *
 * Reusable help button used inside the card.
 * - Opens a small popover with explanatory text
 * - Closes automatically when the user clicks outside
 * - Wrapped in a ref so outside-click detection stays local to this component
 */
function InfoButton({ title, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close the popover when the user clicks anywhere outside it
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
    <div ref={ref} className="visibilitybox-info">
      <button
        type="button"
        className={`visibilitybox-info-button ${open ? "is-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        i
      </button>

      {open && (
        <div className="visibilitybox-info-popover">
          <h4 className="visibilitybox-info-title">{title}</h4>
          <div className="visibilitybox-info-content">{children}</div>
        </div>
      )}
    </div>
  );
}

export default function VisibilityBox({
  visibility = 0,
  nowTime = "",
  unitDist = "km",
  hourlyData = [],
}) {
  const isMiles = unitDist === "mi";

  // Chart max changes with display unit so the scale stays readable.
  const maxV = isMiles ? 10 : 16;

  /**
   * Use five values to match the five time markers on the chart:
   * 00, 06, 12, 18, 24.
   *
   * If hourly data is missing, repeat the current visibility so the chart
   * still renders a stable fallback instead of breaking.
   */
  const rawData =
    Array.isArray(hourlyData) && hourlyData.length >= 5
      ? hourlyData.slice(0, 5)
      : [visibility, visibility, visibility, visibility, visibility];

  /**
   * Normalize the data into plain numeric values.
   *
   * Supports:
   * - raw numbers
   * - API objects like { visibility: ... }
   *
   * Some APIs return visibility in meters, so larger values are converted
   * into the active display unit before plotting.
   */
  const parsedData = rawData.map((item) => {
    const rawVal = typeof item === "object" ? item.visibility : item;
    let num = Number(rawVal);

    // Fall back to the current reading if the hourly value is missing/invalid
    if (isNaN(num) || rawVal === undefined) {
      num = visibility;
    }

    // Values above 100 are assumed to be raw meters from the API
    if (num > 100) {
      num = isMiles ? num / 1609.34 : num / 1000;
    }

    return num;
  });

  const width = 255;
  const height = 130;

  /**
   * Convert each visibility value into an SVG point.
   *
   * Each point is:
   * - clamped to the chart scale so it never draws outside bounds
   * - spaced evenly across the width of the chart
   * - inverted vertically because SVG y=0 starts at the top
   */
  const pointsArray = parsedData.map((val, i) => {
    const clampedVal = Math.max(0, Math.min(val, maxV));
    return `${i * (width / 4)},${height - (clampedVal / maxV) * height}`;
  });

  // Polyline path for the forecast trend
  const points = pointsArray.join(" ");

  // Polygon used to fill the area under the line with a gradient
  const polygonPoints = `0,${height} ${points} ${width},${height}`;

  // Axis labels are different depending on whether the user is viewing km or mi
  const yLabels = isMiles ? [10, 8, 6, 4, 2, 0] : [16, 12, 8, 4, 0];
  const xLabels = ["00", "06", "12", "18", "24"];

  return (
    <div className="visibilitybox-card">
      <InfoButton title="Visibility Guide">
        <ul className="visibilitybox-info-list">
          <li>
            <strong>Excellent:</strong> 10+ km (6+ mi). The air is perfectly
            clear.
          </li>
          <li>
            <strong>Good/Fair:</strong> 2 - 10 km (1 - 6 mi). Slight haze,
            rain, or light fog.
          </li>
          <li>
            <strong>Poor:</strong> Under 1 km (0.6 mi). Dense fog, heavy snow,
            or severe storms. Driving can be dangerous.
          </li>
        </ul>
      </InfoButton>

      {/* Header shows the current reading and the time it applies to */}
      <div className="visibilitybox-header">
        {nowTime ? `Now, ${nowTime}` : "Now"}
        <br />
        {visibility} {unitDist} visibility
      </div>

      {/* Main chart drawing area */}
      <div className="visibilitybox-chart">
        <svg
          className="visibilitybox-svg"
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Soft fade under the trend line */}
            <linearGradient id="visGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.0)" />
            </linearGradient>
          </defs>

          {/* Horizontal guide lines aligned with y-axis labels */}
          {yLabels.map((val) => {
            const yPos = height - (val / maxV) * height;

            return (
              <line
                key={`grid-${val}`}
                x1="0"
                y1={yPos}
                x2={width}
                y2={yPos}
                className="visibilitybox-grid-line"
              />
            );
          })}

          <polygon points={polygonPoints} fill="url(#visGradient)" />

          <polyline
            points={points}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Dots make each sampled time point easier to read */}
          {pointsArray.map((pt, i) => {
            const [x, y] = pt.split(",");

            return (
              <circle
                key={`dot-${i}`}
                cx={x}
                cy={y}
                r="3"
                fill="#FFFFFF"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>

      {/* Left-side y-axis labels switch scale depending on distance unit */}
      <div
        className={`visibilitybox-y-axis ${
          isMiles ? "visibilitybox-y-axis--miles" : "visibilitybox-y-axis--km"
        }`}
      >
        {yLabels.map((val, index) => (
          <div
            key={val}
            className={`visibilitybox-y-label visibilitybox-y-label--${index}`}
          >
            {val}
          </div>
        ))}
      </div>

      {/* Bottom x-axis labels represent forecast offsets in hours */}
      <div className="visibilitybox-x-axis">
        {xLabels.map((label, index) => (
          <div
            key={label}
            className={`visibilitybox-x-label visibilitybox-x-label--${index}`}
          >
            +{label}h
          </div>
        ))}
      </div>
    </div>
  );
}