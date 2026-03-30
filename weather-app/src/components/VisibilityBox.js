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

export default function VisibilityBox({ visibility = 0, nowTime = "", unitDist = "km", hourlyData = [] }) {
  const isMiles = unitDist === "mi";
  const maxV = isMiles ? 10 : 16;

  // Auto-corrects if the API passes raw 10,000+ meters instead of miles/km
  const data = (Array.isArray(hourlyData) && hourlyData.length >= 5 ? hourlyData.slice(0, 5) : [visibility, visibility, visibility, visibility, visibility]).map(val => {
      let num = Number(val) || 0;
      if (num > 100) num = isMiles ? num / 1609.34 : num / 1000;
      return num;
  });

  const width = 255;
  const height = 130;
  const points = data.map((val, i) => {
    const clampedVal = Math.max(0, Math.min(val, maxV));
    return `${i * (width / 4)},${height - (clampedVal / maxV) * height}`;
  }).join(" ");

  const yLabels = isMiles ? [10, 8, 6, 4, 2, 0] : [16, 12, 8, 4, 0];

  return (
    <div style={{ width: "100%", height: 220, position: "relative", background: "rgba(255, 255, 255, 0.70)", boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.18)", borderRadius: 28, overflow: "hidden", fontFamily: "Rubik, sans-serif" }}>
      <div style={{ position: "absolute", left: 16, top: 16, right: 46, fontSize: 14, fontWeight: 500, color: "black", zIndex: 2, lineHeight: 1.4 }}>
        {nowTime ? `Now, ${nowTime}` : "Now"}<br />
        {visibility} {unitDist} visibility
      </div>

      <InfoButton message={`Current visibility is ${visibility} ${unitDist}.`} />

      <div style={{ position: "absolute", left: 55, right: 16, top: 60, bottom: 30, borderLeft: "1px solid rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(0,0,0,0.3)", zIndex: 1 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <polyline points={points} fill="none" stroke="black" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>

      <div style={{ position: "absolute", left: 5, top: 60, bottom: 30, width: 45 }}>
        {yLabels.map(val => (
          <div key={val} style={{ position: "absolute", top: `${100 - (val/maxV)*100}%`, right: 0, transform: "translateY(-50%)", fontSize: 10, fontWeight: 500, color: "black" }}>
            {val}
          </div>
        ))}
      </div>

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