import React from "react";
import HourCard from "./HourCard";
import "./HourlyForecast.css";
import sunny from "../assets/weather-icons/Sunny.svg";
import clouds from "../assets/weather-icons/clouds.svg";
import rainy from "../assets/weather-icons/rainy.svg";
import stormy from "../assets/weather-icons/stormy.svg";
import partlyCloudy from "../assets/weather-icons/sun-clouds.svg";

function HourlyForecast()
{
    const hourlyData = [
    { time: "11am", icon: rainy, temp: 13, rain: "5%", wind: 15 },
    { time: "12pm", icon: clouds, temp: 13, rain: "5%", wind: 15 },
    { time: "1pm", icon: partlyCloudy, temp: 14, rain: "5%", wind: 16 },
    { time: "2pm", icon: partlyCloudy, temp: 14, rain: "5%", wind: 16 },
    { time: "3pm", icon: rainy, temp: 13, rain: "10%", wind: 15 },
    { time: "4pm", icon: rainy, temp: 13, rain: "10%", wind: 15 },
    { time: "5pm", icon: stormy, temp: 12, rain: "10%", wind: 15 },
    { time: "6pm", icon: stormy, temp: 12, rain: "10%", wind: 15 }
    ];

  return (
    <div className="hourly-forecast">
      {hourlyData.map((hour, index) => (
        <HourCard
          key={index}
          time={hour.time}
          icon={hour.icon}
          temp={hour.temp}
          rain={hour.rain}
          wind={hour.wind}
        />
      ))}
    </div>
  );
}

export default HourlyForecast;