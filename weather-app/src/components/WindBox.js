import React, { useState, useEffect, useRef } from "react";
import compass from "../assets/Compass.png";

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

  const toggleOpen = () => {
    const newState = !open;
    setOpen(newState);
    if (onToggle) onToggle(newState); 
  };

  return (
    <div ref={ref} style={{ position: "absolute", top: 12, right: 12, zIndex: 1000 }}>
      <button
        onClick={toggleOpen}
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

// ─── Main WindBox Component ───────────────────────────────────────────────────
export default function WindBox({
  windSpeed = 0,
  windGust = 0,
  windDeg = 0,
  windDir = "N",
  nowTime = "",
  unitWind = "km/h"
}) {
  const [isFront, setIsFront] = useState(false);
  const windAngle = windDeg + 90;

  return (
    <div style={{ 
      width: "100%", 
      height: 190, 
      position: "relative", 
      background: "rgba(255,255,255,0.70)", 
      borderRadius: 28, 
      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.18)", 
      fontFamily: "Rubik, sans-serif",
      // These two lines ensure the box floats over others when 'i' is clicked:
      overflow: "visible", 
      zIndex: isFront ? 100 : 1 
    }}>
      
      <InfoButton title="Wind Conditions" onToggle={setIsFront}>
        <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li><strong>Wind Speed:</strong> The sustained baseline speed of the wind currently blowing.</li>
          <li><strong>Gusts:</strong> Sudden, brief increases in wind speed. Gusts are usually much higher than the sustained speed.</li>
          <li><strong>Direction:</strong> The compass direction the wind is blowing <em>from</em>. For example, a North ({windDir}) wind blows from North to South.</li>
        </ul>
      </InfoButton>

      <div style={{ position: "absolute", left: 20, top: 16, fontSize: 14, fontWeight: 500, color: "black" }}>
        {nowTime ? `Now, ${nowTime}` : "Now"}
      </div>

      <div style={{ position: "absolute", left: 20, top: 60, display: "grid", gridTemplateColumns: "80px 75px", rowGap: 18, columnGap: 10, alignItems: "center", color: "black" }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>Wind</div>
        <div style={{ fontWeight: 500, fontSize: 13 }}>{windSpeed} {unitWind}</div>

        <div style={{ fontWeight: 700, fontSize: 13 }}>Gusts</div>
        <div style={{ fontWeight: 500, fontSize: 13 }}>{windGust} {unitWind}</div>

        <div style={{ fontWeight: 700, fontSize: 13 }}>Direction</div>
        <div style={{ fontWeight: 500, fontSize: 13 }}>{String(windDeg).padStart(3, "0")}° {windDir}</div>
      </div>

      <div style={{ position: "absolute", right: 20, top: 30, width: 132, height: 132, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={compass} alt="compass" style={{ width: "100%", height: "100%", transform: `rotate(${windAngle}deg)`, transformOrigin: "center", transition: "transform 0.5s ease" }} />
        <div style={{ position: "absolute", fontSize: 12, fontWeight: 700, color: "black", textShadow: "0px 0px 4px white" }}>
          {windSpeed} {unitWind}
        </div>
      </div>
    </div>
  );
}