import React from 'react';

function InfoButton({ message }) {
  return (
    <button
      onClick={() => alert(message)}
      style={{
        position: "absolute", top: 12, right: 12, width: 28, height: 28,
        borderRadius: "50%", border: "none", background: "#CBD2D0",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.18)", display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 18,
        fontWeight: 700, fontFamily: "Rubik, sans-serif", cursor: "pointer",
        color: "black", zIndex: 20,
      }}
    >
      i
    </button>
  );
}

export default function HumidityBox({ humidity = 0, humidityAvg = 0, nowTime = "", hourlyData = [] }) {
  // Safe fallback if data is missing
  const data = (Array.isArray(hourlyData) && hourlyData.length >= 5) 
    ? hourlyData.slice(0, 5) 
    : [humidity, humidity, humidity, humidity, humidity];

  const maxH = 100;
  const width = 255;
  const height = 130; // Adjusted graph height to prevent text overlap
  
  const points = data.map((val, i) => {
    const safeVal = isNaN(Number(val)) ? humidity : Number(val);
    const clampedVal = Math.max(0, Math.min(safeVal, maxH)); // Keeps line inside the box
    return `${i * (width / 4)},${height - (clampedVal / maxH) * height}`;
  }).join(" ");

  return (
    <div style={{ width: "100%", height: 220, position: "relative", background: "rgba(255, 255, 255, 0.70)", boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.18)", borderRadius: 28, overflow: "hidden", fontFamily: "Rubik, sans-serif" }}>
      
      {/* Title Area - Given more breathing room */}
      <div style={{ position: "absolute", left: 16, top: 16, right: 46, fontSize: 14, fontWeight: 500, color: "black", zIndex: 2, lineHeight: 1.4 }}>
        {nowTime ? `Now, ${nowTime}` : "Now"}<br />
        {humidity}% humidity
      </div>

      <InfoButton message={`Current humidity is ${humidity}%. Average today is ${humidityAvg}%.`} />

      {/* Graph Container - Pushed down and right to clear labels */}
      <div style={{ position: "absolute", left: 55, right: 16, top: 60, bottom: 30, borderLeft: "1px solid rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(0,0,0,0.3)", zIndex: 1 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <polyline points={points} fill="none" stroke="black" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Perfectly Spaced Y-Axis Labels */}
      <div style={{ position: "absolute", left: 5, top: 60, bottom: 30, width: 45 }}>
        {[100, 75, 50, 25, 0].map(val => (
          <div key={val} style={{ position: "absolute", top: `${100 - val}%`, right: 0, transform: "translateY(-50%)", fontSize: 10, fontWeight: 500, color: "black" }}>
            {val}%
          </div>
        ))}
      </div>

      {/* Perfectly Spaced X-Axis Labels */}
      <div style={{ position: "absolute", left: 55, right: 16, bottom: 12, height: 15 }}>
        {["00", "06", "12", "18", "24"].map((t, i) => (
          <div key={t} style={{ position: "absolute", left: `${i * 25}%`, transform: "translateX(-50%)", fontSize: 10, fontWeight: 500, color: "black" }}>
            +{t}h
          </div>
        ))}
      </div>
    </div>
  );
}