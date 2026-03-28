import compass from "../assets/Compass.png";

function InfoButton({ message }) {
  return (
    <button
      onClick={() => alert(message)}
      style={{
        position: "absolute",
        top: 10,
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
        fontFamily: "Rubik",
        cursor: "pointer",
        color: "black",
        zIndex: 20,
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
}) {
  // Compass image points WEST by default; rotate by windDeg to show actual direction
  const windAngle = windDeg;

  return (
    <div
      style={{
        width: "100%",
        height: 190,
        position: "relative",
        background: "rgba(255,255,255,0.70)",
        borderRadius: 28,
        boxShadow: "0px 3px 6px rgba(0,0,0,0.18)",
        overflow: "hidden",
        fontFamily: "Rubik",
      }}
    >
      {/* Icon */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 16,
          fontSize: 22,
          opacity: 0.8,
        }}
      >
        🍃
      </div>

      <InfoButton
        message={`Wind: ${windSpeed} mph, gusts up to ${windGust} mph, direction ${windDeg}° ${windDir}.`}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 70,
          right: 40,
          textAlign: "center",
          color: "black",
          lineHeight: 1.15,
        }}
      >
        <div style={{ fontWeight: 500, fontSize: 13 }}>
          {nowTime ? `Now, ${nowTime}` : "Now"}
        </div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>
          {windGust > windSpeed
            ? `Light winds with gusts of ${windGust}mph`
            : `Wind speed ${windSpeed}mph`}
        </div>
      </div>

      {/* Data */}
      <div
        style={{
          position: "absolute",
          left: 22,
          top: 66,
          display: "grid",
          gridTemplateColumns: "78px 62px",
          rowGap: 18,
          columnGap: 10,
          alignItems: "center",
          color: "black",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 13 }}>Wind</div>
        <div style={{ fontWeight: 500, fontSize: 13 }}>{windSpeed}</div>

        <div style={{ fontWeight: 700, fontSize: 13 }}>Gusts</div>
        <div style={{ fontWeight: 500, fontSize: 13 }}>{windGust}</div>

        <div style={{ fontWeight: 700, fontSize: 13 }}>Direction</div>
        <div style={{ fontWeight: 500, fontSize: 13 }}>
          {String(windDeg).padStart(3, "0")}° {windDir}
        </div>
      </div>

      {/* Compass */}
      <div
        style={{
          position: "absolute",
          right: 20,
          top: 38,
          width: 132,
          height: 132,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={compass}
          alt="compass"
          style={{
            width: "100%",
            height: "100%",
            transform: `rotate(${windAngle}deg)`,
            transformOrigin: "center",
          }}
        />

        <div
          style={{
            position: "absolute",
            fontSize: 14,
            fontWeight: 600,
            color: "black",
          }}
        >
          {windSpeed} mph
        </div>
      </div>
    </div>
  );
}
