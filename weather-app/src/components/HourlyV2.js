import React from "react";
import "./HourlyV2.css";

function HourlyV2() {
  const renderCard = (time, temp, rain, wind) => (
    <div className="v2-hour-card">
      <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{time}</span>
      <div className="icon-placeholder">icon</div>
      <span style={{ fontSize: "1.3rem" }}>{temp}</span>
      <span style={{ color: "#005bb5", fontWeight: "500" }}>{rain}</span>
      <span>{wind}</span>
    </div>
  );

  return (
    <div className="hourly-forecast-v2">
      {renderCard("time_current", "temp_current", "rain_current", "wind_current")}
      {renderCard("time_+1", "temp_+1", "rain_+1", "wind_+1")}
      {renderCard("time_+2", "temp_+2", "rain_+2", "wind_+2")}
      {renderCard("time_+3", "temp_+3", "rain_+3", "wind_+3")}
      {renderCard("time_+4", "temp_+4", "rain_+4", "wind_+4")}
      {renderCard("time_+5", "temp_+5", "rain_+5", "wind_+5")}
      {renderCard("time_+6", "temp_+6", "rain_+6", "wind_+6")}
      {renderCard("time_+7", "temp_+7", "rain_+7", "wind_+7")}
      {renderCard("time_+8", "temp_+8", "rain_+8", "wind_+8")}
      {renderCard("time_+9", "temp_+9", "rain_+9", "wind_+9")}
      {renderCard("time_+10", "temp_+10", "rain_+10", "wind_+10")}
      {renderCard("time_+11", "temp_+11", "rain_+11", "wind_+11")}
    </div>
  );
}

export default HourlyV2;