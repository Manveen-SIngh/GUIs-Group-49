import sunnyIcon   from '../assets/weather-icons/Sunny.svg';
import cloudsIcon  from '../assets/weather-icons/clouds.svg';
import rainyIcon   from '../assets/weather-icons/rainy.svg';
import stormyIcon  from '../assets/weather-icons/stormy.svg';
import windyIcon   from '../assets/weather-icons/windy.svg';
import partlyIcon  from '../assets/weather-icons/sun-clouds.svg';
import nightIcon   from '../assets/weather-icons/night.svg';
import cloudyNight from '../assets/weather-icons/cloudyNight.svg';
import rainyNight  from '../assets/weather-icons/rainyNight.svg';

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

const isNightHour = (timeStr) => {
  const h = parseInt(timeStr.slice(0, 2));
  return h < 6 || h >= 20;
};

const getConditionIcon = (condition, isNight = false) => {
  if (isNight) {
    if (condition === "Clear")                           return nightIcon;
    if (condition === "Clouds")                          return cloudyNight;
    if (condition === "Rain" || condition === "Drizzle") return rainyNight;
    if (condition === "Thunderstorm")                    return stormyIcon;
    return cloudyNight;
  }
  if (condition === "Clear")                           return sunnyIcon;
  if (condition === "Clouds")                          return cloudsIcon;
  if (condition === "Rain" || condition === "Drizzle") return rainyIcon;
  if (condition === "Thunderstorm")                    return stormyIcon;
  if (condition === "Wind")                            return windyIcon;
  return partlyIcon;
};

function WeatherIcon({ condition, time }) {
  return (
    <img
      src={getConditionIcon(condition, time ? isNightHour(time) : false)}
      alt={condition || "weather"}
      style={{ width: 34, height: 34, objectFit: "contain" }}
    />
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
        <WeatherIcon condition={hour.condition} time={hour.time} />
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

export default function WeatherBox({ hourly = [], description = "", nowTime = "" }) {
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
        <InfoButton message={description || "Hourly forecast for the next 12 hours."} />

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
          {nowTime ? `Now, ${nowTime}` : "Now"}
          <br />
          {description || "Hourly forecast"}
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
          {hourly.map((hour, i) => (
            <HourBlock key={hour.time || i} hour={hour} />
          ))}
        </div>
      </div>
    </div>
  );
}
