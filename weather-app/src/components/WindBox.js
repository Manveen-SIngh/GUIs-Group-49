import compass from "../assets/Compass.png";

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

export default function WindBox({
  windSpeed = 0,
  windGust = 0,
  windDeg = 0,
  windDir = "N",
  nowTime = "",
  unitWind = "km/h"
}) {
  const windAngle = windDeg + 90;

  return (
    <div style={{ width: "100%", height: 190, position: "relative", background: "rgba(255,255,255,0.70)", borderRadius: 28, boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.18)", fontFamily: "Rubik, sans-serif" }}>
      <InfoButton message={`Wind: ${windSpeed} ${unitWind}, gusts up to ${windGust} ${unitWind}, direction ${windDeg}° ${windDir}.`} />

      <div style={{ position: "absolute", left: 20, top: 16, fontSize: 14, fontWeight: 500, color: "black" }}>
        {nowTime ? `Now, ${nowTime}` : "Now"}
      </div>

      {/* Expanded Grid Columns from 78px to 80px/75px to stop clipping */}
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