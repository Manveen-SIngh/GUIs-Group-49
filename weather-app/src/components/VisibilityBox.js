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

export default function VisibilityBox() {
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
        fontFamily: "Rubik",
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
        👁️
      </div>

      <InfoButton message="Visibility is around 15 miles and conditions are perfectly clear." />

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
        Now,12:11
        <br />
        15mi, Perfectly Clear
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
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 255 160"
          preserveAspectRatio="none"
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <path
            d="M0 78
               Q35 78 65 76
               Q95 70 126 58
               Q160 60 196 78
               Q224 98 255 130"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
        </svg>
      </div>

      {["30", "25", "20", "15", "10"].map((label, i) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: 2,
            top: 40 + i * 30,
            width: 40,
            textAlign: "center",
            fontSize: 10,
            fontWeight: 500,
            color: "black",
            zIndex: 2,
          }}
        >
          {label}
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: 18,
          bottom: 12,
          width: 22,
          textAlign: "center",
          fontSize: 10,
          fontWeight: 500,
          color: "black",
          zIndex: 2,
        }}
      >
        5
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