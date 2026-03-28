import "./HourlyV2.css";
import sunnyIcon  from '../assets/weather-icons/Sunny.svg';
import cloudsIcon from '../assets/weather-icons/clouds.svg';
import rainyIcon  from '../assets/weather-icons/rainy.svg';
import stormyIcon from '../assets/weather-icons/stormy.svg';
import windyIcon  from '../assets/weather-icons/windy.svg';
import partlyIcon from '../assets/weather-icons/sun-clouds.svg';

const getConditionIcon = (condition) => {
  if (condition === "Clear")                           return sunnyIcon;
  if (condition === "Clouds")                          return cloudsIcon;
  if (condition === "Rain" || condition === "Drizzle") return rainyIcon;
  if (condition === "Thunderstorm")                    return stormyIcon;
  if (condition === "Wind")                            return windyIcon;
  return partlyIcon;
};

function HourlyV2({ hourly = [] }) {
  return (
    <div className="hourly-forecast-v2">
      {hourly.map((h, i) => (
        <div key={i} className="v2-hour-card">
          <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{h.time}</span>
          <img src={getConditionIcon(h.condition)} alt={h.condition || "weather"} className="v2-weather-icon" />
          <span style={{ fontSize: "1.3rem" }}>{h.temp}</span>
          <span style={{ color: "#005bb5", fontWeight: "500" }}>{h.rain}</span>
          <span>{h.wind}</span>
        </div>
      ))}
    </div>
  );
}

export default HourlyV2;
