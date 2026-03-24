const hours = [
  { time: "Now", temp: "13°C", rain: "<5%" },
  { time: "1pm", temp: "13°C", rain: "<5%" },
  { time: "2pm", temp: "14°C", rain: "<5%" },
  { time: "3pm", temp: "14°C", rain: "10%" },
  { time: "4pm", temp: "13°C", rain: "10%" },
  { time: "5pm", temp: "12°C", rain: "10%" },
  { time: "6pm", temp: "12°C", rain: "10%" },
  { time: "7pm", temp: "11°C", rain: "10%" },
  { time: "8pm", temp: "11°C", rain: "<5%" },
  { time: "9pm", temp: "10°C", rain: "<5%" },
  { time: "10pm", temp: "9°C", rain: "<5%" },
  { time: "11pm", temp: "8°C", rain: "<5%" },
];

function InfoButton({ message }) {
  return (
    <button
      onClick={() => alert(message)}
      style={{
        position: "absolute",
        top: 10,
        right: 14,
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

function WeatherIcon() {
  return (
    <div style={{ width: 34, height: 24, position: "relative" }}>
      <div
        style={{
          width: 22,
          height: 14,
          position: "absolute",
          left: 8,
          top: 0,
          background: "linear-gradient(30deg, #FF9900 0%, #FFEE94 100%)",
          borderRadius: "50%",
          boxShadow: "0px 3px 8px rgba(255,255,255,0.7) inset",
        }}
      />
      <div
        style={{
          width: 30,
          height: 14,
          position: "absolute",
          left: 0,
          top: 9,
          borderRadius: 20,
          background:
            "linear-gradient(322deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.5) 100%)",
          boxShadow:
            "0px 6px 6px rgba(255,255,255,0.7) inset, 0px 2px 3px rgba(0,0,0,0.18)",
        }}
      />
    </div>
  );
}

function RainIndicator({ value }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        color: "rgba(0,0,0,0.6)",
        fontSize: 14,
        fontFamily: "Rubik, sans-serif",
        fontWeight: 400,
      }}
    >
      <div style={{ display: "flex", gap: 2 }}>
        <div
          style={{
            width: 6,
            height: 7,
            background: "#26b7ff",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            width: 7,
            height: 8,
            background: "#26b7ff",
            borderRadius: "50%",
          }}
        />
      </div>
      <span>{value}</span>
    </div>
  );
}

function HourBlock({ hour }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontFamily: "Rubik, sans-serif",
          fontWeight: 500,
          color: "black",
          marginBottom: 8,
        }}
      >
        {hour.time}
      </div>

      <div style={{ marginBottom: 8 }}>
        <WeatherIcon />
      </div>

      <div
        style={{
          fontSize: 14,
          fontFamily: "Rubik, sans-serif",
          fontWeight: 400,
          color: "rgba(0,0,0,0.65)",
          marginBottom: 8,
        }}
      >
        {hour.temp}
      </div>

      <RainIndicator value={hour.rain} />
    </div>
  );
}

export default function WeatherBox() {
  return (
    <div
      style={{
        width: "100%",
        marginTop: 14,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1950,
          minHeight: 220,
          background: "rgba(255,255,255,0.70)",
          borderRadius: 36,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.18)",
          padding: "14px 18px 16px",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        <InfoButton message="Hourly forecast: mostly cloudy with a low chance of rain through the afternoon and evening." />

        <div
          style={{
            textAlign: "center",
            color: "black",
            fontSize: 13,
            fontFamily: "Rubik",
            fontWeight: 500,
            lineHeight: 1.2,
            marginBottom: 14,
          }}
        >
          Now, 12:11
          <br />
          Mostly cloudy with few brighter spells and a low chance of rain
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, minmax(70px, 1fr))",
            columnGap: 6,
            justifyItems: "center",
            alignItems: "start",
            marginTop: 2,
          }}
        >
          {hours.map((hour) => (
            <HourBlock key={hour.time} hour={hour} />
          ))}
        </div>
      </div>
    </div>
  );
}