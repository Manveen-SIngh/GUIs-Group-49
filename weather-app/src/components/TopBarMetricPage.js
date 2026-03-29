import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backIcon from "../assets/BackBtn.png";
import Clock from "./Clock";

export default function TopBarMetricPage() {
  const navigate = useNavigate();
  const [unit, setUnit] = useState("C");

  return (
    <div
      style={{
        width: "100%",
        height: 100,
        position: "relative",
        marginBottom: 10,
        fontFamily: "Rubik",
      }}
    >
      <img
        src={backIcon}
        alt="back"
        onClick={() => navigate('/WeatherPage')}
        style={{
          width: 64,
          height: 64,
          position: "absolute",
          left: 8,
          top: 8,
          cursor: "pointer",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 150,
          top: 14,
          width: 136,
          height: 56,
          borderRadius: 999,
          background: "rgba(255,255,255,0.55)",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.16)",
          padding: 4,
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 4,
            left: unit === "C" ? 4 : 68,
            width: 64,
            height: 48,
            borderRadius: 999,
            background: "rgba(203,210,208,0.55)",
            boxShadow: "0px 2px 4px rgba(0,0,0,0.12)",
            transition: "left 0.2s ease",
          }}
        />

        <button
          onClick={() => setUnit("C")}
          style={{
            width: 64,
            height: 48,
            border: "none",
            background: "transparent",
            position: "relative",
            zIndex: 1,
            fontSize: 26,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          °C
        </button>

        <button
          onClick={() => setUnit("F")}
          style={{
            width: 64,
            height: 48,
            border: "none",
            background: "transparent",
            position: "relative",
            zIndex: 1,
            fontSize: 26,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          °F
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          right: 18,
          top: 6,
        }}
      >
        <Clock />
      </div>
    </div>
  );
}