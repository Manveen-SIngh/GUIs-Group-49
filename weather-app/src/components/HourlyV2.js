import "./HourlyV2.css";
import HourCard from "./HourCard";
import sunnyIcon    from '../assets/weather-icons/Sunny.svg';
import cloudsIcon   from '../assets/weather-icons/clouds.svg';
import rainyIcon    from '../assets/weather-icons/rainy.svg';
import stormyIcon   from '../assets/weather-icons/stormy.svg';
import windyIcon    from '../assets/weather-icons/windy.svg';
import partlyIcon   from '../assets/weather-icons/sun-clouds.svg';
import nightIcon    from '../assets/weather-icons/night.svg';
import cloudyNight  from '../assets/weather-icons/cloudyNight.svg';
import rainyNight   from '../assets/weather-icons/rainyNight.svg';

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

const isNightHour = (timeStr) => {
  const h = parseInt(timeStr.slice(0, 2));
  return h < 6 || h >= 20;
};

function HourlyV2({ hourly = [] }) {
  return (
    <div className="hourly-forecast-v2">
      {hourly.map((h, i) => (
        <HourCard
          key={i}
          time={h.time}
          icon={getConditionIcon(h.condition, isNightHour(h.time))}
          temp={h.temp}
          rain={h.rain}
          wind={h.wind}
          windDeg={h.windDeg ?? 0}
        />
      ))}
    </div>
  );
}

export default HourlyV2;
