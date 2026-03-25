import React from "react";
import HourCard from "./HourCard";
import "./HourlyV2.css";
import sunny from "../assets/weather-icons/Sunny.svg";
import clouds from "../assets/weather-icons/clouds.svg";
import rainy from "../assets/weather-icons/rainy.svg";
import stormy from "../assets/weather-icons/stormy.svg";
import partlyCloudy from "../assets/weather-icons/sun-clouds.svg";

function HourlyForecast() {
  return (
    <div className="hourly-forecast">
      {/* current Hour */}
      <HourCard 
        time="time_current" 
        icon="icon_current" 
        temp="temp_current" 
        rain="rain_current" 
        wind="wind_current" 
      />

      {/* Hour + 1 */}
      <HourCard 
        time="time_+1" 
        icon="icon_+1" 
        temp="temp_+1" 
        rain="rain_+1" 
        wind="wind_+1" 
      />

      {/* Hour + 2 */}
      <HourCard 
        time="time_+2" 
        icon="icon_+2" 
        temp="temp_+2" 
        rain="rain_+2" 
        wind="wind_+2" 
      />

      {/* Hour + 3 */}
      <HourCard 
        time="time_+3" 
        icon="icon_+3" 
        temp="temp_+3" 
        rain="rain_+3" 
        wind="wind_+3" 
      />

      {/* Hour + 4 */}
      <HourCard 
        time="time_+4" 
        icon="icon_+4" 
        temp="temp_+4" 
        rain="rain_+4" 
        wind="wind_+4" 
      />

      {/* Hour + 5 */}
      <HourCard 
        time="time_+5" 
        icon="icon_+5" 
        temp="temp_+5" 
        rain="rain_+5" 
        wind="wind_+5" 
      />

      {/* Hour + 6 */}
      <HourCard 
        time="time_+6" 
        icon="icon_+6" 
        temp="temp_+6" 
        rain="rain_+6" 
        wind="wind_+6" 
      />

      {/* Hour + 7 */}
      <HourCard 
        time="time_+7" 
        icon="icon_+7" 
        temp="temp_+7" 
        rain="rain_+7" 
        wind="wind_+7" 
      />

      {/* Hour + 8 */}
      <HourCard 
        time="time_+8" 
        icon="icon_+8" 
        temp="temp_+8" 
        rain="rain_+8" 
        wind="wind_+8" 
      />

      {/* Hour + 9 */}
      <HourCard 
        time="time_+9" 
        icon="icon_+9" 
        temp="temp_+9" 
        rain="rain_+9" 
        wind="wind_+9" 
      />

      {/* Hour + 10 */}
      <HourCard 
        time="time_+10" 
        icon="icon_+10" 
        temp="temp_+10" 
        rain="rain_+10" 
        wind="wind_+10" 
      />

      {/* Hour + 11 */}
      <HourCard 
        time="time_+11" 
        icon="icon_+11" 
        temp="temp_+11" 
        rain="rain_+11" 
        wind="wind_+11" 
      />
    </div>
  );
}

export default HourlyForecast;