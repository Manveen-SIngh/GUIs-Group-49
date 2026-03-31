import React, { useState, useEffect, useRef } from 'react';
import sunnyIcon   from '../assets/weather-icons/Sunny.svg';
import cloudsIcon  from '../assets/weather-icons/clouds.svg';
import rainyIcon   from '../assets/weather-icons/rainy.svg';
import stormyIcon  from '../assets/weather-icons/stormy.svg';
import windyIcon   from '../assets/weather-icons/windy.svg';
import partlyIcon  from '../assets/weather-icons/sun-clouds.svg';
import nightIcon   from '../assets/weather-icons/night.svg';
import cloudyNight from '../assets/weather-icons/cloudyNight.svg';
import rainyNight  from '../assets/weather-icons/rainyNight.svg';

// Import your custom precipitation SVG
import precipitationIcon from '../assets/precipitation.svg';

// ─── Custom Info Popover ──────────────────────────────────────────────────────
function InfoButton({ title, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close the popup if the user clicks anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "absolute", top: 14, right: 18, zIndex: 30 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "none",
          background: open ? "#26b7ff" : "#CBD2D0",
          color: open ? "#fff" : "black",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "Rubik, sans-serif",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
      >
        i
      </button>

      {/* The Detailed Dropdown Popup */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 36,
            right: 0,
            width: 280,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "16px",
            borderRadius: "16px",
            boxShadow: "0px 8px 32px rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.4)",
            textAlign: "left",
            color: "#333",
            fontFamily: "Rubik, sans-serif",
            animation: "fadeIn 0.2s ease-out"
          }}
        >
          <h4 style={{ margin: "0 0 12px 0", fontSize: 16, color: "#000" }}>{title}</h4>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(0,0,0,0.8)" }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Weather Logic & Sub-Components ───────────────────────────────────────────
const isNightHour = (timeStr) => {
  if (!timeStr) return false;
  const h = parseInt(timeStr.slice(0, 2));
  return h < 6 || h >= 20;
};

const getConditionIcon = (condition, isNight = false) => {
  if (isNight) {
    if (condition === "Clear")                           return nightIcon;
    if (condition === "Clouds")                          return cloudyNight;
    if (condition === "Rain" || condition === "Drizzle") return rainyNight;
    if (condition === "Thunderstorm")                    return stormyIcon;
    return cloudyNight;
  }
  if (condition === "Clear")                           return sunnyIcon;
  if (condition === "Clouds")                          return cloudsIcon;
  if (condition === "Rain" || condition === "Drizzle") return rainyIcon;
  if (condition === "Thunderstorm")                    return stormyIcon;
  if (condition === "Wind")                            return windyIcon;
  return partlyIcon;
};

function WeatherIcon({ condition, time }) {
  return (
    <img
      src={getConditionIcon(condition, time ? isNightHour(time) : false)}
      alt={condition || "weather"}
      style={{ width: 38, height: 38, objectFit: "contain" }}
    />
  );
}

function RainIndicator({ rainString }) {
  if (!rainString) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        color: "rgba(0,0,0,0.7)",
        fontFamily: "Rubik, sans-serif",
        marginTop: 4,
      }}
    >
      <img 
        src={precipitationIcon} 
        alt="precipitation" 
        style={{ width: 14, height: 14, objectFit: "contain" }} 
      />
      <span style={{ fontSize: 13, fontWeight: 500 }}>{rainString}</span>
    </div>
  );
}

function HourBlock({ hour, tempUnit }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 4, 
      }}
    >
      {/* Time */}
      <div
        style={{
          fontSize: 15,
          fontFamily: "Rubik, sans-serif",
          fontWeight: 600,
          color: "black",
        }}
      >
        {hour.time}
      </div>

      {/* Icon */}
      <WeatherIcon condition={hour.condition} time={hour.time} />

      {/* Condition Text */}
      <div style={{ fontSize: 12, fontFamily: "Rubik, sans-serif", color: "rgba(0,0,0,0.6)", height: 28, display: "flex", alignItems: "center" }}>
        {hour.condition}
      </div>

      {/* Temp with Unit */}
      <div
        style={{
          fontSize: 16,
          fontFamily: "Rubik, sans-serif",
          fontWeight: 700,
          color: "black",
        }}
      >
        {hour.temp}°{tempUnit}
      </div>

      {/* Precipitation */}
      <RainIndicator rainString={hour.rain} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WeatherBox({ hourly = [], description = "", nowTime = "", tempUnit = "C" }) {
  return (
    <div
      style={{
        width: "100%",
        marginTop: 14,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1950,
          minHeight: 220,
          background: "rgba(255,255,255,0.70)",
          borderRadius: 36,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.18)",
          padding: "14px 18px 16px",
          position: "relative",
          boxSizing: "border-box",
          // REMOVED: overflowX: "auto" so the box grows downward instead of scrolling
        }}
      >
        
        {/* --- UPGRADED DETAILED INFO BUTTON --- */}
        <InfoButton title="Hourly Forecast Guide">
          <p style={{ margin: "0 0 8px 0" }}>
            This panel shows the expected weather conditions for the next 12 hours.
          </p>
          <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li><strong>Condition:</strong> The general state of the weather (e.g., Rain, Clear) accompanied by an icon.</li>
            <li><strong>Temperature:</strong> The forecasted air temperature for that specific hour.</li>
            <li><strong>Precipitation (%):</strong> The Probability of Precipitation (POP). This is the likelihood that rain or snow will occur in your area during this hour.</li>
          </ul>
        </InfoButton>
        {/* -------------------------------------- */}

        <div
          style={{
            textAlign: "center",
            color: "black",
            fontSize: 13,
            fontFamily: "Rubik",
            fontWeight: 500,
            lineHeight: 1.2,
            marginBottom: 20, 
          }}
        >
          {nowTime ? `Now, ${nowTime}` : "Now"}
          <br />
          {description || "Hourly forecast"}
        </div>

        {/* CHANGED: Switched to Flexbox with wrapping instead of a strict Grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16, // Adds perfect spacing between rows and columns
            marginTop: 2,
          }}
        >
          {hourly.map((hour, i) => (
            <div key={hour.time || i} style={{ width: 80 }}> {/* Fixed width keeps columns neat */}
              <HourBlock hour={hour} tempUnit={tempUnit} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}