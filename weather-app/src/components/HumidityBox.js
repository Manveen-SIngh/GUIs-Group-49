import React, { useState, useEffect, useRef } from 'react';

// ─── Custom Info Popover (With Scrolling) ─────────────────────────────────────
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
    <div ref={ref} style={{ position: "absolute", top: 12, right: 12, zIndex: 50 }}>
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
            width: 260,
            
            /* Scrolling Logic */
            maxHeight: 180,
            overflowY: "auto", 
            
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

// ─── Main HumidityBox Component ───────────────────────────────────────────────
export default function HumidityBox({ humidity = 0, humidityAvg = 0, nowTime = "", hourlyData = [] }) {
  // Safe fallback if data is missing
  const data = (Array.isArray(hourlyData) && hourlyData.length >= 5) 
    ? hourlyData.slice(0, 5) 
    : [humidity, humidity, humidity, humidity, humidity];

  const maxH = 100;
  const width = 255;
  const height = 130; 
  
  // Calculate the path points for the line
  const pointsArray = data.map((val, i) => {
    const safeVal = isNaN(Number(val)) ? humidity : Number(val);
    const clampedVal = Math.max(0, Math.min(safeVal, maxH)); 
    return `${i * (width / 4)},${height - (clampedVal / maxH) * height}`;
  });

  const points = pointsArray.join(" ");
  // Calculate the polygon points for the gradient fill underneath the line
  const polygonPoints = `0,${height} ${points} ${width},${height}`;

  const yLabels = [100, 75, 50, 25, 0];

  return (
    <div style={{ 
      width: "100%", 
      height: 220, 
      position: "relative", 
      background: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(10px)",
      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.18)",
      borderRadius: 28,
      // REMOVED overflow: "hidden" so the popover isn't clipped
      fontFamily: "Rubik, sans-serif"
    }}>
      
      {/* --- UPGRADED DETAILED INFO BUTTON --- */}
      <InfoButton title="Humidity Guide">
        <p style={{ margin: "0 0 8px 0" }}>
          Relative humidity measures how much moisture is in the air compared to what the air can hold.
        </p>
        <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li><strong>Under 30%:</strong> Dry. Can cause dry skin and static electricity.</li>
          <li><strong>30% - 60%:</strong> Comfortable. Ideal indoor and outdoor conditions.</li>
          <li><strong>60% - 80%:</strong> Muggy. Sweat evaporates slower, making it feel hotter.</li>
          <li><strong>80%+:</strong> Oppressive. Very uncomfortable and sticky.</li>
        </ul>
      </InfoButton>
      {/* -------------------------------------- */}

      {/* Title Area */}
      <div style={{ position: "absolute", left: 16, top: 16, right: 46, fontSize: 14, fontWeight: 500, color: "black", zIndex: 2, lineHeight: 1.4 }}>
        {nowTime ? `Now, ${nowTime}` : "Now"}<br />
        {humidity}% humidity
      </div>

      {/* Graph Area */}
      <div style={{ position: "absolute", left: 55, right: 16, top: 60, bottom: 30, borderLeft: "1px solid rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(0,0,0,0.3)", zIndex: 1 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="humGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(38, 183, 255, 0.4)" />
              <stop offset="100%" stopColor="rgba(38, 183, 255, 0.0)" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {yLabels.map(val => {
            const yPos = height - (val / maxH) * height;
            return (
              <line key={`grid-${val}`} x1="0" y1={yPos} x2={width} y2={yPos} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            );
          })}

          {/* Area Fill */}
          <polygon points={polygonPoints} fill="url(#humGradient)" />

          {/* Main Line */}
          <polyline points={points} fill="none" stroke="#26b7ff" strokeWidth="3" strokeLinejoin="round" />
          
          {/* Data Points (Dots) */}
          {pointsArray.map((pt, i) => {
            const [x, y] = pt.split(",");
            return <circle key={`dot-${i}`} cx={x} cy={y} r="3" fill="white" stroke="#26b7ff" strokeWidth="2" />;
          })}
        </svg>
      </div>

      {/* Y-Axis Labels */}
      <div style={{ position: "absolute", left: 5, top: 60, bottom: 30, width: 45 }}>
        {yLabels.map(val => (
          <div key={val} style={{ position: "absolute", top: `${100 - val}%`, right: 0, transform: "translateY(-50%)", fontSize: 10, fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>
            {val}%
          </div>
        ))}
      </div>

      {/* X-Axis Labels */}
      <div style={{ position: "absolute", left: 55, right: 16, bottom: 12, height: 15 }}>
        {["00", "06", "12", "18", "24"].map((t, i) => (
          <div key={t} style={{ position: "absolute", left: `${i * 25}%`, transform: "translateX(-50%)", fontSize: 10, fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>
            +{t}h
          </div>
        ))}
      </div>
      
    </div>
  );
}