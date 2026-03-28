import "./HourlyV2.css";

function HourlyV2({ hourly = [] }) {
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
      {hourly.map((h, i) =>
        renderCard(h.time, h.temp, h.rain, h.wind)
      )}
    </div>
  );
}

export default HourlyV2;
