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
            top: 36, // See pro-tip below if you want it to pop UP instead!
            right: 0,
            width: 260,
            
            /* --- NEW SCROLLING LOGIC --- */
            maxHeight: 180,      // Forces the box to stop growing at 180px tall
            overflowY: "auto",   // Adds a scrollbar if the text exceeds 180px
            /* --------------------------- */

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

// ─── Helper Functions ─────────────────────────────────────────────────────────
const getUVColor = (uvi) => {
  if (uvi < 3) return "#3BC50F";  // Low
  if (uvi < 6) return "#F8D448";  // Moderate
  if (uvi < 8) return "#FFAB1C";  // High
  if (uvi < 11) return "#FF4A3A"; // Very High
  return "#D82DE2";               // Extreme
};

// ─── Main UVBox Component ─────────────────────────────────────────────────────
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
      
      {/* --- UPGRADED DETAILED INFO BUTTON --- */}
      <InfoButton title="UV Index Guide">
        <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li><strong>0-2 (Low):</strong> Minimal danger. Safe to be outside.</li>
          <li><strong>3-5 (Moderate):</strong> Risk of harm from unprotected sun exposure. Wear sunscreen and a hat.</li>
          <li><strong>6-7 (High):</strong> High risk. Reduce time in the sun between 10 AM and 4 PM.</li>
          <li><strong>8-10 (Very High):</strong> Very high risk. Unprotected skin can burn quickly.</li>
          <li><strong>11+ (Extreme):</strong> Extreme risk of harm. Take all precautions.</li>
        </ul>
      </InfoButton>
      {/* -------------------------------------- */}

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