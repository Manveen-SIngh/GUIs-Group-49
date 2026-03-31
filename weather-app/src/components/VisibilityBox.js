import React, { useState, useEffect, useRef } from 'react';

// ─── Custom Info Popover (With Scrolling) ─────────────────────────────────────
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
          background: open ? "#FFFFFF" : "#CBD2D0", 
          color: open ? "#000" : "black",           
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

// ─── Main VisibilityBox Component ─────────────────────────────────────────────
export default function VisibilityBox({ visibility = 0, nowTime = "", unitDist = "km", hourlyData = [] }) {
  const isMiles = unitDist === "mi";
  const maxV = isMiles ? 10 : 16;

  // 1. Properly extract data whether it's an array of numbers OR API objects
  const rawData = (Array.isArray(hourlyData) && hourlyData.length >= 5) 
    ? hourlyData.slice(0, 5) 
    : [visibility, visibility, visibility, visibility, visibility];

  const parsedData = rawData.map(item => {
    // Look for the visibility property if it's an object from the API
    let rawVal = typeof item === 'object' ? item.visibility : item;
    let num = Number(rawVal);
    
    // Fallback to the current hour's visibility if data is missing
    if (isNaN(num) || rawVal === undefined) num = visibility;

    // Auto-convert raw meters (e.g. 10000) into miles/km
    if (num > 100) num = isMiles ? num / 1609.34 : num / 1000;
    return num;
  });

  const width = 255;
  const height = 130;
  
  const pointsArray = parsedData.map((val, i) => {
    const clampedVal = Math.max(0, Math.min(val, maxV));
    return `${i * (width / 4)},${height - (clampedVal / maxV) * height}`;
  });
  
  const points = pointsArray.join(" ");
  const polygonPoints = `0,${height} ${points} ${width},${height}`;

  const yLabels = isMiles ? [10, 8, 6, 4, 2, 0] : [16, 12, 8, 4, 0];

  return (
    <div style={{ 
      width: "100%", 
      height: 220, 
      position: "relative", 
      background: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(10px)",
      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.18)",
      borderRadius: 28,
      fontFamily: "Rubik, sans-serif"
    }}>
      
      <InfoButton title="Visibility Guide">
        <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li><strong>Excellent:</strong> 10+ km (6+ mi). The air is perfectly clear.</li>
          <li><strong>Good/Fair:</strong> 2 - 10 km (1 - 6 mi). Slight haze, rain, or light fog.</li>
          <li><strong>Poor:</strong> Under 1 km (0.6 mi). Dense fog, heavy snow, or severe storms. Driving can be dangerous.</li>
        </ul>
      </InfoButton>

      <div style={{ position: "absolute", left: 16, top: 16, right: 46, fontSize: 14, fontWeight: 500, color: "black", zIndex: 2, lineHeight: 1.4 }}>
        {nowTime ? `Now, ${nowTime}` : "Now"}<br />
        {visibility} {unitDist} visibility
      </div>

      <div style={{ position: "absolute", left: 55, right: 16, top: 60, bottom: 30, borderLeft: "1px solid rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(0,0,0,0.3)", zIndex: 1 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          
          <defs>
            <linearGradient id="visGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.0)" />
            </linearGradient>
          </defs>

          {yLabels.map(val => {
            const yPos = height - (val / maxV) * height;
            return (
              <line key={`grid-${val}`} x1="0" y1={yPos} x2={width} y2={yPos} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            );
          })}

          <polygon points={polygonPoints} fill="url(#visGradient)" />
          
          <polyline points={points} fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinejoin="round" />
          
          {pointsArray.map((pt, i) => {
            const [x, y] = pt.split(",");
            return <circle key={`dot-${i}`} cx={x} cy={y} r="3" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="2" />;
          })}
        </svg>
      </div>

      <div style={{ position: "absolute", left: 5, top: 60, bottom: 30, width: 45 }}>
        {yLabels.map(val => (
          <div key={val} style={{ position: "absolute", top: `${100 - (val/maxV)*100}%`, right: 0, transform: "translateY(-50%)", fontSize: 10, fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>
            {val}
          </div>
        ))}
      </div>

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