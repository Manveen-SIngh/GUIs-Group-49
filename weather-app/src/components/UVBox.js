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

export default function UVBox() {
  return (
    <div
      style={{
        width: "100%",
        height: 220,
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
          left: 14,
          top: 10,
          fontSize: 22,
          zIndex: 2,
        }}
      >
        ☀️
      </div>

      <InfoButton message="UV levels are low throughout the day." />

      <div
        style={{
          position: "absolute",
          top: 10,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "black",
          fontSize: 11,
          fontWeight: 500,
          lineHeight: 1.2,
          zIndex: 2,
        }}
      >
        Now, 12:11
        <br />
        Low levels all day
      </div>

      <div
        style={{
          position: "absolute",
          left: 50,
          right: 16,
          top: 40,
          bottom: 30,
          borderLeft: "1px solid black",
          borderBottom: "1px solid black",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "32%",
            height: 2,
            background: "black",
          }}
        />

        <svg
          width="100%"
          height="100%"
          viewBox="0 0 255 160"
          preserveAspectRatio="none"
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <path
            d="M0 145
               Q28 142 52 136
               Q78 126 104 112
               Q130 98 154 92
               Q182 92 205 101
               Q228 112 255 138"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: 2,
          top: 40,
          width: 48,
          textAlign: "center",
          fontSize: 10,
          fontWeight: 500,
          color: "black",
          zIndex: 2,
        }}
      >
        Extreme
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 78,
          width: 50,
          textAlign: "center",
          fontSize: 10,
          fontWeight: 500,
          color: "black",
          zIndex: 2,
        }}
      >
        Very High
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 118,
          width: 50,
          textAlign: "center",
          fontSize: 10,
          fontWeight: 500,
          color: "black",
          zIndex: 2,
        }}
      >
        Moderate
      </div>

      <div
        style={{
          position: "absolute",
          left: 10,
          top: 160,
          width: 40,
          textAlign: "center",
          fontSize: 10,
          fontWeight: 500,
          color: "black",
          zIndex: 2,
        }}
      >
        Low
      </div>

      {["00", "06", "12", "18", "24"].map((t, i) => (
        <div
          key={t}
          style={{
            position: "absolute",
            left: `${18 + i * 19}%`,
            bottom: 12,
            width: 22,
            textAlign: "center",
            fontSize: 10,
            fontWeight: 500,
            color: "black",
            zIndex: 2,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
}