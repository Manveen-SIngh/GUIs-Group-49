import React from 'react';

// Reusable InfoButton Component
function InfoButton({ message }) {
  return (
    <button
      onClick={() => alert(message)}
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        width: 28,
        height: 28,
        borderRadius: "50%",
        border: "none",
        background: "#CBD2D0",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: 700,
        fontFamily: "Rubik, sans-serif",
        cursor: "pointer",
        color: "black",
        zIndex: 20,
      }}
    >
      i
    </button>
  );
}

const getUVColor = (uvi) => {
  if (uvi < 3) return "#3BC50F"; // Low
  if (uvi < 6) return "#F8D448"; // Moderate
  if (uvi < 8) return "#FFAB1C"; // High
  if (uvi < 11) return "#FF4A3A"; // Very High
  return "#D82DE2"; // Extreme
};

export default function UVBox({ uvi = 0, label = "Low" }) {
  // Calculate percentage for a visual bar (based on standard max of 11+)
  const percentage = Math.min((uvi / 11) * 100, 100);

  return (
    <div style={{
      width: "100%", 
      height: 160, 
      background: "rgba(255, 255, 255, 0.7)", 
      borderRadius: 28, 
      padding: 20,
      position: "relative",
      fontFamily: "Rubik, sans-serif",
      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.18)"
    }}>
      {/* Information Button */}
      <InfoButton message={`Current UV Index is ${Math.round(uvi)} (${label}). ${uvi >= 3 ? "Sun protection is recommended." : ""}`} />

      <div style={{ fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.6)" }}>
        UV INDEX
      </div>
      
      <div style={{ marginTop: 10 }}>
        <span style={{ fontSize: 32, fontWeight: 600 }}>{Math.round(uvi)}</span>
        <span style={{ fontSize: 18, fontWeight: 500, marginLeft: 10 }}>{label}</span>
      </div>

      {/* Visual Progress Bar */}
      <div style={{ 
        width: "100%", 
        height: 8, 
        background: "rgba(0,0,0,0.1)", 
        borderRadius: 4, 
        marginTop: 20,
        overflow: "hidden" 
      }}>
        <div style={{ 
          width: `${percentage}%`, 
          height: "100%", 
          background: getUVColor(uvi),
          transition: "width 0.5s ease-in-out"
        }} />
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: "rgba(0,0,0,0.5)", lineHeight: "1.4" }}>
        {uvi >= 3 ? "Use sun protection 11am-4pm." : "Low levels for the rest of the day."}
      </div>
    </div>
  );
}