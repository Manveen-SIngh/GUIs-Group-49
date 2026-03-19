function InfoButton() {
  return (
    <button
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
        fontFamily: "Rubik, sans-serif",
        cursor: "pointer",
      }}
    >
      i
    </button>
  );
}

export default function SunriseSunsetBox() {
  const sunriseHour = 6 + 7 / 60;
  const sunsetHour = 18 + 8 / 60;
  const currentHour = 12 + 11 / 60;

  const progress = (currentHour - sunriseHour) / (sunsetHour - sunriseHour);
  const clamped = Math.max(0, Math.min(1, progress));

  const startX = 40;
  const endX = 782;
  const controlX = 411;
  const controlY = -40;

  const horizonY = 80;
  const arcStartY = 105;
  const arcEndY = 105;

  const sunX = startX + (endX - startX) * clamped;

  function quadY(t) {
    return (
      (1 - t) * (1 - t) * arcStartY +
      2 * (1 - t) * t * controlY +
      t * t * arcEndY
    );
  }

  const sunY = quadY(clamped);

  return (
    <div
      style={{
        width: "100%",
        height: 190,
        position: "relative",
        background: "rgba(255, 255, 255, 0.70)",
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.18)",
        borderRadius: 28,
        overflow: "hidden",
        fontFamily: "Rubik, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 10,
          fontSize: 22,
        }}
      >
        🌅
      </div>

      <InfoButton />

      <div
        style={{
          position: "absolute",
          left: 28,
          top: 48,
          fontSize: 14,
          fontWeight: 500,
          color: "black",
        }}
      >
        Sunrise: 06:07
      </div>

      <div
        style={{
          position: "absolute",
          right: 28,
          top: 48,
          fontSize: 14,
          fontWeight: 500,
          color: "black",
        }}
      >
        Sunset: 18:08
      </div>

      <svg
        width="100%"
        height="130"
        viewBox="0 0 822 130"
        style={{
          position: "absolute",
          left: 0,
          top: 52,
        }}
      >
        <path
          d={`M ${startX} ${arcStartY} Q ${controlX} ${controlY} ${endX} ${arcEndY}`}
          fill="none"
          stroke="black"
          strokeWidth="2"
        />

        <line
          x1="20"
          y1={horizonY}
          x2="802"
          y2={horizonY}
          stroke="black"
          strokeWidth="1.5"
        />

        <circle
          cx={sunX}
          cy={sunY}
          r="12"
          fill="#f5c242"
          stroke="#d79f1b"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}