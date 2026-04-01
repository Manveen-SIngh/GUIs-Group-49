import React, { useState, useEffect, useRef } from "react";
import "./UVBox.css";

/**
 * InfoButton
 *
 * Reusable floating help button.
 * - Toggles a popover panel
 * - Closes automatically when clicking outside
 * - Used across multiple metric cards for consistency
 */
function InfoButton({ title, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close popover when clicking outside the component
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
    <div ref={ref} className="uvbox-info">
      <button
        className={`uvbox-info-button ${open ? "is-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        i
      </button>

      {/* Popover content */}
      {open && (
        <div className="uvbox-info-popover">
          <h4 className="uvbox-info-title">{title}</h4>
          <div className="uvbox-info-content">{children}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Maps UV index values to standard risk colors.
 *
 * These thresholds follow WHO / meteorological guidelines.
 * Used to visually communicate danger level instantly.
 */
const getUVColor = (uvi) => {
  if (uvi < 3) return "#3BC50F";   // Low
  if (uvi < 6) return "#F8D448";   // Moderate
  if (uvi < 8) return "#FFAB1C";   // High
  if (uvi < 11) return "#FF4A3A";  // Very High
  return "#D82DE2";                // Extreme
};

export default function UVBox({ uvi = 0, label = "Low" }) {
  /**
   * Convert UV index into percentage for progress bar.
   * 11 is treated as "max meaningful UV index".
   */
  const percentage = Math.min((uvi / 11) * 100, 100);

  return (
    <div className="uvbox-card">
      <InfoButton title="UV Index Guide">
        <ul className="uvbox-info-list">
          <li><strong>0-2 (Low):</strong> Minimal danger. Safe to be outside.</li>
          <li><strong>3-5 (Moderate):</strong> Risk of harm from unprotected sun exposure.</li>
          <li><strong>6-7 (High):</strong> High risk. Reduce time in direct sun.</li>
          <li><strong>8-10 (Very High):</strong> Skin burns quickly.</li>
          <li><strong>11+ (Extreme):</strong> Take full protection.</li>
        </ul>
      </InfoButton>

      {/* Section label */}
      <div className="uvbox-title">
        UV INDEX
      </div>

      {/* Main value display */}
      <div className="uvbox-value">
        <span className="uvbox-number">{Math.round(uvi)}</span>
        <span className="uvbox-label">{label}</span>
      </div>

      {/* 
        Progress bar:
        - Width reflects UV intensity
        - Color reflects risk level
        - Both must stay dynamic (inline)
      */}
      <div className="uvbox-bar">
        <div
          className="uvbox-bar-fill"
          style={{
            width: `${percentage}%`,
            background: getUVColor(uvi),
          }}
        />
      </div>

      {/* Contextual recommendation */}
      <div className="uvbox-footer">
        {uvi >= 3
          ? "Use sun protection 11am-4pm."
          : "Low levels for the rest of the day."}
      </div>
    </div>
  );
}