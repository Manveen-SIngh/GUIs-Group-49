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

export default function UVBox({ uvLabel = "Low", uvi = 0, nowTime = "", hourlyData = [] }) {
  const data = (Array.isArray(hourlyData) && hourlyData.length >= 5)
    ? hourlyData.slice(0, 5)
    : [uvi, uvi, uvi, uvi, uvi];

  const maxUV = 11;
  const width = 255;
  const height = 130;
  const points = data.map((val, i) => {
    const safeVal = isNaN(Number(val)) ? uvi : Number(val);
    const clampedVal = Math.max(0, Math.min(safeVal, maxUV));
    return `${i * (width / 4)},${height - (clampedVal / maxUV) * height}`;
  }).join(" ");

  const uvRanges = [
    { label: "Extreme", val: 11 },
    { label: "Very High", val: 8 },
    { label: "High", val: 6 },
    { label: "Moderate", val: 3 },
    { label: "Low", val: 0 }
  ];

  return (
    <div style={{ width: "100%", height: 220, position: "relative", background: "rgba(255, 255, 255, 0.70)", boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.18)", borderRadius: 28, overflow: "hidden", fontFamily: "Rubik, sans-serif" }}>
      <div style={{ position: "absolute", left: 16, top: 16, right: 46, fontSize: 14, fontWeight: 500, color: "black", zIndex: 2, lineHeight: 1.4 }}>
        {nowTime ? `Now, ${nowTime}` : "Now"}<br />
        UV Index: {uvi} ({uvLabel})
      </div>

      <InfoButton message={`Current UV Index is ${uvi} (${uvLabel}).`} />

      {/* Expanded left margin to 65 to fit "Very High" text cleanly */}
      <div style={{ position: "absolute", left: 65, right: 16, top: 60, bottom: 30, borderLeft: "1px solid rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(0,0,0,0.3)", zIndex: 1 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <polyline points={points} fill="none" stroke="black" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>

      <div style={{ position: "absolute", left: 5, top: 60, bottom: 30, width: 55 }}>
        {uvRanges.map(range => (
          <div key={range.label} style={{ position: "absolute", top: `${100 - (range.val/maxUV)*100}%`, right: 0, transform: "translateY(-50%)", fontSize: 10, fontWeight: 500, color: "black", lineHeight: 1 }}>
            {range.label}
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 65, right: 16, bottom: 12, height: 15 }}>
        {["00", "06", "12", "18", "24"].map((t, i) => (
          <div key={t} style={{ position: "absolute", left: `${i * 25}%`, transform: "translateX(-50%)", fontSize: 10, fontWeight: 500, color: "black" }}>
            +{t}h
          </div>
        ))}
      </div>
    </div>
  );
}