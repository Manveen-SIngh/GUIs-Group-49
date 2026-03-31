import React, { useState, useEffect, useRef } from "react";

// ─── Custom Info Popover ──────────────────────────────────────────────────────
function InfoButton({ title, children, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
        if (onToggle) onToggle(false); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onToggle]);

  const handleToggle = () => {
    const nextState = !open;
    setOpen(nextState);
    if (onToggle) onToggle(nextState);
  };

  return (
    <div ref={ref} style={{ position: "absolute", top: 12, right: 12, zIndex: 1000 }}>
      <button
        onClick={handleToggle}
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

      {open && (
        <div
          style={{
            position: "absolute",
            top: 36,
            right: 0,
            width: 260,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "16px",
            borderRadius: "16px",
            boxShadow: "0px 12px 40px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.4)",
            textAlign: "left",
            color: "#333",
            fontFamily: "Rubik, sans-serif",
            animation: "fadeIn 0.2s ease-out",
            zIndex: 1001
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

// ─── Main SunriseSunsetBox Component ──────────────────────────────────────────
export default function SunriseSunsetBox({
  sunrise = "06:07",
  sunset = "18:08",
  sunriseHour = 6 + 7 / 60,
  sunsetHour = 18 + 8 / 60,
  nowHour = 12,
}) {
  const [isFront, setIsFront] = useState(false);

  const progress = (nowHour - sunriseHour) / (sunsetHour - sunriseHour);
  const clamped = Math.max(0, Math.min(1, progress));

  const startX = 40;
  const endX = 782;
  const controlX = 411;
  const controlY = -40;

  const horizonY = 80;
  const arcStartY = 105;
  const arcEndY = 105;

  const sunX = startX + (endX - startX) * clamped;

  function quadY(t) {
    return (
      (1 - t) * (1 - t) * arcStartY +
      2 * (1 - t) * t * controlY +
      t * t * arcEndY
    );
  }

  const sunY = quadY(clamped);

  return (
    <div
      style={{
        width: "100%",
        height: 190,
        position: "relative",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.18)",
        borderRadius: 28,
        fontFamily: "Rubik, sans-serif",
        // Crucial for the popup to float over everything:
        overflow: "visible", 
        zIndex: isFront ? 100 : 1 
      }}
    >
      <InfoButton title="Daylight Tracker" onToggle={setIsFront}>
        <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li><strong>Sun Path:</strong> The curved arc represents the sun's trajectory across the sky throughout the day.</li>
          <li><strong>Current Position:</strong> The yellow dot shows the sun's current estimated position based on the local time.</li>
          <li><strong>Horizon:</strong> The straight horizontal line represents the ground. When the sun dips below this line, it is nighttime.</li>
        </ul>
      </InfoButton>

      <div
        style={{
          position: "absolute",
          left: 28,
          top: 38,
          fontSize: 14,
          fontWeight: 500,
          color: "black",
        }}
      >
        Sunrise: {sunrise}
      </div>

      <div
        style={{
          position: "absolute",
          right: 28,
          top: 38,
          fontSize: 14,
          fontWeight: 500,
          color: "black",
        }}
      >
        Sunset: {sunset}
      </div>

      <svg
        width="100%"
        height="130"
        viewBox="0 0 822 130"
        style={{
          position: "absolute",
          left: 0,
          top: 52,
        }}
      >
        <path
          d={`M ${startX} ${arcStartY} Q ${controlX} ${controlY} ${endX} ${arcEndY}`}
          fill="none"
          stroke="black"
          strokeWidth="2"
        />

        <line
          x1="20"
          y1={horizonY}
          x2="802"
          y2={horizonY}
          stroke="black"
          strokeWidth="1.5"
        />

        <circle
          cx={sunX}
          cy={sunY}
          r="12"
          fill="#f5c242"
          stroke="#d79f1b"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}