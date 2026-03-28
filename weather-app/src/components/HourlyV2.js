import "./HourlyV2.css";
import HourCard from "./HourCard";
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
        <HourCard
          key={i}
          time={h.time}
          icon={getConditionIcon(h.condition)}
          temp={h.temp}
          rain={h.rain}
          wind={h.wind}
        />
      ))}
    </div>
  );
}

export default HourlyV2;
